import cv from '@u4/opencv4nodejs';
import fromColumn from './from-column.js';
import fromCv3d from './from-cv-3d.js';
import toColumn from './to-column.js';

class Camera {
	constructor({
		resolution,
		horizontalFov = 5 / 180 * Math.PI,
		distCoeffs = [0, 0, 0, 0],
		focalRatio = 1,
	}) {
		if (typeof (resolution[0]) !== 'number') {
			throw (new TypeError('resolution should be a number'));
		}

		if (typeof (horizontalFov) !== 'number') {
			throw (new TypeError('horizontalFov should be a number'));
		}

		this.resolution = resolution;
		this.horizontalFov = horizontalFov;
		this.distCoeffs = distCoeffs;
		this.focalRatio = focalRatio;
	}

	getFocalX() {
		const f = this.resolution[0] / (2 * Math.tan(this.horizontalFov / 2));
		if (Number.isNaN(f)) {
			throw (new TypeError('focal length is NaN'));
		}

		return f;
	}

	getFocalY() {
		return this.getFocalX() / this.focalRatio;
	}

	getCameraMatrix() {
		return new cv.Mat([
			[this.getFocalX(), 0, this.resolution[0] / 2],
			[0, this.getFocalY(), this.resolution[1] / 2],
			[0, 0, 1],
		], cv.CV_64F);
	}

	getDistCoeffs() {
		return this.distCoeffs;
	}

	getFocalRatio() {
		return this.focalRatio;
	}

	getPosition(extrinsic) {
		const rodriguesVecMat = toColumn(extrinsic.getRvec());
		const tMat = toColumn(extrinsic.getTvec());

		const rotMatrix = rodriguesVecMat.rodrigues().dst;
		const pos = fromColumn(rotMatrix.transpose().mul(-1).matMul(tMat));
		return fromCv3d(pos);
	}

	getResolution() {
		return this.resolution;
	}
}

const getCamera = function (options) {
	return new Camera(options);
};

export default getCamera;
