const normVec3 = a => {
	const [x, y, z] = a;
	return Math.hypot((x), (y), (z));
};

export default normVec3;
