"use strict;"
var Camera = function () {

    this.kind = CameraKind.MAIN;
    this.fieldOfView = Math.PI / 4;
    this.near = 10;
    this.far = 400;
    this.aspectRatio = 16 / 9;
    this.movement;
    this.frustumMatrix = null;
    this.type = null;
    this.orientation = [0, 0, 0];
    this.position = [0, 0, 0];
    this.cameraMatrix = null;
}
Camera.prototype = {

    dynamic: new Dynamic(),

    buildProjectionMatrix: function () {
        var f, a, m, c;
        this.frustumMatrix = m4.identity();
        f = Math.tan(Math.PI / 2 - this.fieldOfView);
        a = this.aspectRatio;
        m = -2 * (this.far * this.near) / (this.far - this.near);
        c = (this.far + this.near) / (this.far - this.near);
        // ! transposed !
        //0,1,2,3
        //4,5,6,7
        //8,9,10,11
        //12,13,14,15
        this.frustumMatrix[0] = f / a;
        this.frustumMatrix[5] = f
        this.frustumMatrix[10] = c;
        this.frustumMatrix[11] = 1;
        this.frustumMatrix[14] = m;
        this.frustumMatrix[15] = 0;
    },

    buildCameraMatrix: function () {
        var matrix = m4.identity();
        matrix = m4.xRotate(matrix, -this.orientation[0]);
        matrix = m4.yRotate(matrix, -this.orientation[1]);
        matrix = m4.zRotate(matrix, -this.orientation[2]);
        this.cameraMatrix = m4.translate(matrix, -this.position[0],
            -this.position[1], -this.position[2]);
    }
}