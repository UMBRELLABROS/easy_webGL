"use strict;";
var Camera = function() {
  this.kind = CameraKind.MAIN;
  this.fieldOfView = Math.PI / 4;
  this.near = 0.1;
  this.far = 400;
  this.aspectRatio = 16 / 9;
  this.movement;
  this.frustumMatrix = null;
  this.type = null;
  this.cameraMatrix = null;
};
Camera.prototype = {
  dynamic: new Dynamic(),
  lookAt: [0, 0, 0],
  up: [0, 1, 0],
  buildProjectionMatrix: function() {
    var f, a, m, c;
    this.frustumMatrix = m4.identity();
    f = Math.tan(Math.PI / 2 - this.fieldOfView);
    a = this.aspectRatio;
    m = (-2 * (this.far * this.near)) / (this.far - this.near);
    c = (this.far + this.near) / (this.far - this.near);
    // ! transposed !
    //0,1,2,3
    //4,5,6,7
    //8,9,10,11
    //12,13,14,15
    this.frustumMatrix[0] = f / a;
    this.frustumMatrix[5] = f;
    this.frustumMatrix[10] = c;
    this.frustumMatrix[11] = 1;
    this.frustumMatrix[14] = m;
    this.frustumMatrix[15] = 0;
  }
};
