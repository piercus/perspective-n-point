import cv from '@u4/opencv4nodejs';
import fromCv2d from './from-cv-2d.js';
import toCv3d from './to-cv-3d.js';

const project = function ({
	worldCoordinates,
	camera,
	extrinsic,
}) {
	const {imagePoints} = cv.projectPoints(
		worldCoordinates.map(w => toCv3d(w)),
		extrinsic.getRvec(),
		extrinsic.getTvec(),
		camera.getCameraMatrix(),
		camera.getDistCoeffs(),
		camera.getFocalRatio(),
	);

	return imagePoints.map(a => fromCv2d(a));
};

export default project;
