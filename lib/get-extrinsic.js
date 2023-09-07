import cameraLookAt from './camera-look-at.js';
import Extrinsic from './extrinsic.js';

const getExtrinsic = function (options) {
	if (options.rvec && options.tvec) {
		return new Extrinsic(options);
	}

	return cameraLookAt(options);
};

export default getExtrinsic;
