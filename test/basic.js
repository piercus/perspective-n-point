import test from 'ava';
import {solvePnP, getCamera, project, getExtrinsic, reprojectionCosts} from '../index.js';

test('basic example', t => {
	const camera = getCamera({resolution: [1920, 1080]});
	const worldCoordinates = [ // A cube
		[0, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 1],
		[1, 1, 1],
	];

	const imageCoordinates = [ // A cube drawing
		[0, 1],
		[0, 4],
		[1, 0],
		[3, 1],
		[1, 3],
		[3, 4],
		[4, 0],
		[4, 50],
	];
	const out = solvePnP({
		camera,
		worldCoordinates,
		imageCoordinates,
	});

	const projected = project({
		worldCoordinates: [
			[0, 0, 0],
		],
		camera,
		extrinsic: out.extrinsic,
	});

	t.is(projected.length, 1);
	t.is(projected[0].length, 2);

	const tolerance = 0.2;
	console.log({projected})
	t.true(Math.abs(projected[0][0]) < tolerance);
	t.true(Math.abs(projected[0][1] - 1) < tolerance);

	const position = camera.getPosition(out.extrinsic);
	t.true((position[0] - 2103.5) < tolerance);
	t.true((position[1] - 6309.6) < tolerance);
	t.true((position[2] - (-2102.5)) < tolerance);
	const costs = reprojectionCosts({
		camera,
		worldCoordinates,
		imageCoordinates,
		extrinsic: out.extrinsic,
	});

	t.true(costs.length < worldCoordinates.length);
	t.true(costs[0] < tolerance);
});

test('basic example ransac', t => {
	const camera = getCamera({resolution: [1920, 1080]});

	const worldCoordinates = [ // A cube
		[0, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 1],
		[1, 1, 1],
	];

	const imageCoordinates = [ // A cube drawing
		[0, 1],
		[0, 4],
		[1, 0],
		[3, 1],
		[1, 3],
		[3, 4],
		[4, 0],
		[4, 50],
	];

	const out = solvePnP({
		camera,
		worldCoordinates,
		imageCoordinates,
		ransac: true,
	});

	t.is(out.inliers.length, 7);
	const projected = project({
		worldCoordinates: [
			[0, 0, 0],
		],
		camera,
		extrinsic: out.extrinsic,
	});

	t.is(projected.length, 1);
	t.is(projected[0].length, 2);

	const tolerance = 0.2;
	t.true(Math.abs(projected[0][0]) < tolerance);
	t.true(Math.abs(projected[0][1] - 1) < tolerance);
});

test('basic advanced example', t => {
	const camera = getCamera({resolution: [1920, 1080]});

	const extrinsic = getExtrinsic({
		camera,
		position: [-10, -10, 5],
		target3dPoint: [0, 0, 0],
		target2dPoint: [960, 540],
	});

	const out = solvePnP({
		camera,
		worldCoordinates: [ // A cube
			[0, 0, 0],
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1],
			[1, 1, 0],
			[1, 0, 1],
			[0, 1, 1],
			[1, 1, 1],
		],
		imageCoordinates: [ // A cube drawing
			[0, 1],
			[0, 4],
			[1, 0],
			[3, 1],
			[1, 3],
			[3, 4],
			[4, 0],
			[4, 3],
		],
		extrinsincGuess: extrinsic,
	});

	const projected = project({
		worldCoordinates: [
			[0, 0, 0],
		],
		camera,
		extrinsic: out.extrinsic,
	});

	t.is(projected.length, 1);
	t.is(projected[0].length, 2);

	const tolerance = 0.2;
	t.true(Math.abs(projected[0][0]) < tolerance);
	t.true(Math.abs(projected[0][1] - 1) < tolerance);

	const position = camera.getPosition(out.extrinsic);
	t.true((position[0] - (-2102.5)) < tolerance);
	t.true((position[1] - (-6308.6)) < tolerance);
	t.true((position[2] - (2103.5)) < tolerance);
});
