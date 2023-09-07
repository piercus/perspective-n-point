import cv from '@u4/opencv4nodejs';

const fromColumn = function (mat) {
	const data = mat.getDataAsArray();

	if (data.length !== 3 || data[0].length !== 1) {
		throw (new Error('not the expected 3x1 column matrix'));
	}

	return new cv.Point3(data[0][0], data[1][0], data[2][0]);
};

export default fromColumn;
