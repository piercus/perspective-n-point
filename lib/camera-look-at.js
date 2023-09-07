import cv from '@u4/opencv4nodejs';
import norm3d from './norm-vec3.js';
import norm2d from './norm-vec2.js';
import matMul from './mat-mul.js';
import toCV3d from './to-cv-3d.js';
import Extrinsic from './extrinsic.js';

const cameraLookAt = function ({
	position,
	target3dPoint,
	target2dPoint,
	camera,
	rotation = 0,
}) {
	if (!position) {
		throw (new Error('position is mandatory'));
	}

	if (!target3dPoint) {
		throw (new Error('target3dPoint is mandatory'));
	}

	if (!camera) {
		throw (new Error('camera is mandatory'));
	}

	const distCoeffs = camera.getDistCoeffs();
	const resolution = camera.getResolution();

	const relative = position.map((_, index) => position[index] - target3dPoint[index]);
	const distance = norm3d(relative);
	const distanceAzi = norm2d([relative[0], relative[1]]);
	const polar = Math.asin(distanceAzi / distance);

	const azimuth = Math.atan2(relative[1], relative[0]);

	if (!target2dPoint) {
		target2dPoint = [
			(resolution[0] / 2),
			(resolution[1] / 2),
		];
	}

	const objectPoints = [
		[0, 0, 0],
		[0, 0, 1],
		[Math.cos(azimuth), Math.sin(azimuth), 0],
		[-1 * Math.sin(azimuth), Math.cos(azimuth), 0],
		[0, 0, -1],
		[-1 * Math.cos(azimuth), -1 * Math.sin(azimuth), 0],
		[Math.sin(azimuth), -1 * Math.cos(azimuth), 0], // ,
	].map(a => toCV3d([a[0] + target3dPoint[0], a[1] + target3dPoint[1], a[2] + target3dPoint[2]]));

	const fx = camera.getFocalX();
	const fy = camera.getFocalY();

	const imagePoints = [
		[0, 0],
		[
			0,
			-1 * (Math.sin(polar) / (distance - Math.cos(polar))), // https://www.geogebra.org/calculator/hqzkzhn3
		],
		[
			0,
			(Math.cos(polar) / (distance - Math.sin(polar))), // https://www.geogebra.org/calculator/hqzkzhn3
		],
		[
			1 / distance, // Thales
			0,
		],
		[
			0,
			(Math.sin(polar) / (distance + Math.cos(polar))), // https://www.geogebra.org/calculator/hqzkzhn3
		],
		[
			0,
			-1 * (Math.cos(polar) / (distance + Math.sin(polar))), // https://www.geogebra.org/calculator/hqzkzhn3
		],
		[
			-1 / distance, // Thales
			0,
		],
	].map(a => {
		const correctedRotation = Math.atan2(Math.sin(rotation) * fy, Math.cos(rotation) * fx);
		const rotMat = [[Math.cos(correctedRotation), -Math.sin(correctedRotation)], [Math.sin(correctedRotation), Math.cos(correctedRotation)]];
		const b = [[a[0]], [a[1]]];
		const [[x], [y]] = matMul(rotMat, b);
		return [x, y];
	})
		.map(a => ([
			(a[0] * fx) + target2dPoint[0],
			(a[1] * fy) + target2dPoint[1],
		]))
		.map(a => new cv.Point2(a[0], a[1]));

	const {rvec, tvec} = cv.solvePnP(objectPoints, imagePoints, camera.getCameraMatrix(), distCoeffs, {flags: cv.SOLVEPNP_DLS, useExtrinsicGuess: false});

	if (Number.isNaN(tvec.x)) {
		throw (new TypeError('nan tvec'));
	}

	return new Extrinsic({rvec, tvec});
};

export default cameraLookAt;
