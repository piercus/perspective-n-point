import normVec2 from './norm-vec2.js';
import project from './project.js';

const reprojectionCosts = function (options) {
	const {imageCoordinates} = options;
	const projections = project(options);

	return projections.map((p, index) => normVec2([p[0] - imageCoordinates[index][0], p[1] - imageCoordinates[index][1]]));
};

export default reprojectionCosts;
