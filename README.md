# perspective-n-point

Node.js utilities for perspective-n-point

## Install

```
npm install perspective-n-point
```

## solvePnP simple usage

```js
const {solvePnP, getCamera, project} = require('perspective-n-point');

const camera = getCamera({resolution: [1920, 1080]})

const out = solvePnP({
	camera,
	worldCoordinates: [ // a cube
		[0,0,0],
		[1,0,0],
		[0,1,0],
		[0,0,1],
		[1,1,0],
		[1,0,1],
		[0,1,1],
		[1,1,1],
	],
	imageCoordinates: [ // a cube drawing
		[0,1],
		[0,4],
		[1,0],
		[3,1],
		[1,3],
		[3,4],
		[4,0],
		[4,3]
	]
})

const projected = project({
	worldCoordinates: [
		[0,0,0]
	], 
	camera,
	extrinsic
})

console.log(projected)

```

Warning, there are often multiple different solution for the same `solvePnP`, please check `init` option to help this algorithm

## solvePnP advanced usage

```js
const {solvePnP, getCamera, project, getExtrinsic} = require('perspective-n-point');

const camera = getCamera({
	resolution: [1920, 1080], 
	horizontalFov: 5 / 180 * Math.PI, // default is 5 / 180 * Math.PI
	distCoeffs: [0,0,0,0] // default is [0,0,0,0]
})

const extrinsic = getExtrinsic({
	camera,
	position : [-10, -10, 5], 
	target3dPoint: [0, 0, 0], 
	target2dPoint: [960, 540]
})

const out = solvePnP({
	camera,
	worldCoordinates: [ // a cube
		[0,0,0],
		[1,0,0],
		[0,1,0],
		[0,0,1],
		[1,1,0],
		[1,0,1],
		[0,1,1],
		[1,1,1],
	],
	imageCoordinates: [ // a cube drawing
		[0,1],
		[0,4],
		[1,0],
		[3,1],
		[1,3],
		[3,4],
		[4,0],
		[4,3]
	],
	ransac: true,
	extrinsincGuess: extrinsic
})

console.log(out)
```
