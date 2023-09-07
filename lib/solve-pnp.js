import cv from '@u4/opencv4nodejs';
import getExtrinsic from './get-extrinsic.js';
import toCv3d from './to-cv-3d.js';

const solvePnP = function ({
	worldCoordinates,
	imageCoordinates,
	camera,
	flags = cv.SOLVEPNP_ITERATIVE,
	extrinsincGuess = null,
}) {
	const wCv = worldCoordinates.map(w => toCv3d(w));
	const imCv = imageCoordinates.map(a => new cv.Point2(a[0], a[1]));
	const camMatCv = camera.getCameraMatrix();
	const distCoeffs = camera.getDistCoeffs();

	let extrinsic;

	if (extrinsincGuess) {
		const out = cv.solvePnP(
			wCv,
			imCv,
			camMatCv,
			distCoeffs, {
				rvec: extrinsincGuess.getRvec(),
				tvec: extrinsincGuess.getTvec(),
				useExtrinsicGuess: true,
				flags,
			},
		);

		extrinsic = getExtrinsic(out);
	} else {
		const out = cv.solvePnP(
			wCv,
			imCv,
			camMatCv,
			distCoeffs,
		);
		extrinsic = getExtrinsic(out);
	}

	return {
		extrinsic,
	};
};

export default solvePnP;
