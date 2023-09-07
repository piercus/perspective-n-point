
const matMul = function (m1, m2) {
	const rows = m1.length;
	const cols = m2[0].length;
	const hidden1 = m1[0].length;
	const hidden2 = m2.length;
	if (hidden1 !== hidden2) {
		throw (new Error('dim not matching'));
	}

	const result = [];

	for (let i = 0; i < rows; i++) {
		result[i] = [];
		for (let j = 0; j < cols; j++) {
			let sum = 0;
			for (let k = 0; k < hidden1; k++) {
				sum += m1[i][k] * m2[k][j];
			}

			result[i].push(sum);
		}
	}

	return result;
};

export default matMul;
