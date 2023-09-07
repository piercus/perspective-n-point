class Extrinsic {
	constructor({
		rvec,
		tvec,
	}) {
		if (typeof (rvec.x) !== 'number') {
			throw (new TypeError('invalid rvec'));
		}

		if (typeof (tvec.x) !== 'number') {
			throw (new TypeError('invalid tvec'));
		}

		this.rvec = rvec;
		this.tvec = tvec;
	}

	getRvec() {
		return this.rvec;
	}

	getTvec() {
		return this.tvec;
	}
}

export default Extrinsic;
