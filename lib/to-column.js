import cv from '@u4/opencv4nodejs';

const toColumn = function (vec) {
	return new cv.Mat([[vec.x], [vec.y], [vec.z]], cv.CV_64F);
};

export default toColumn;
