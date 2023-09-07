import cv from '@u4/opencv4nodejs';

const toCv3d = a => new cv.Point3(a[0], -a[1], -a[2]);

export default toCv3d;
