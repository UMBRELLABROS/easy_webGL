"use strict;"
var Camera = function () {

    this.kind = CameraKind.MAIN;
    this.fieldOfView = Math.PI / 4;
    this.near = 10;
    this.far = 400;
    this.aspectRatio = 16 / 9;
    this.movement;
    this.matrix = null;
}
Camera.prototype = {

    buildProjectionMatrix: function () {
        var f, a, m, c;
        this.matrix = m4.identity();
        f = Math.tan(Math.PI / 2 - this.fieldOfView);
        a = this.aspectRatio;
        m = -2 * (this.far * this.near) / (this.far - this.near);
        c = (this.far + this.near) / (this.far - this.near);
        // ! transposed !
        //0,1,2,3
        //4,5,6,7
        //8,9,10,11
        //12,13,14,15
        this.matrix[0] = f / a;
        this.matrix[5] = f
        this.matrix[10] = c;
        this.matrix[11] = 1;
        this.matrix[14] = m;
        this.matrix[15] = 0;
    },
}