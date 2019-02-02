"use strict;"
var Dynamic = function () {
    this.active = false;

    this.position = [0, 0, 0];
    this.orientation = [0, 0, 0];

    this.rotate = [0, 0, 0];
    this.velocity = [0, 0, 0];

    this.rotate2 = [0, 0, 0];

}

Dynamic.prototype = {

    buildMatrix: function () {
        var matrix = m4.identity()

        var p = this.position;
        matrix = m4.translate(matrix, p[0], p[1], p[2]);

        var r = this.rotate;
        this.orientation[0] += r[0];
        this.orientation[1] += r[1];
        this.orientation[2] += r[2];
        matrix = m4.xRotate(matrix, this.orientation[0]);
        matrix = m4.yRotate(matrix, this.orientation[1]);
        matrix = m4.zRotate(matrix, this.orientation[2]);

        var v = this.velocity;
        matrix = m4.translate(matrix, v[0], v[1], v[2]);

        var r2 = this.rotate2;
        matrix = m4.xRotate(matrix, r2[0]);
        matrix = m4.yRotate(matrix, r2[1]);
        matrix = m4.zRotate(matrix, r2[2]);

        return matrix;
    },
    buildCameraMatrix: function () {
        var matrix = m4.identity()

        var r = this.rotate;
        this.orientation[0] += r[0];
        this.orientation[1] += r[1];
        this.orientation[2] += r[2];
        matrix = m4.xRotate(matrix, this.orientation[0]);
        matrix = m4.yRotate(matrix, this.orientation[1]);
        matrix = m4.zRotate(matrix, this.orientation[2]);

        var p = this.position;
        matrix = m4.translate(matrix, p[0], p[1], p[2]);

        var v = this.velocity;
        matrix = m4.translate(matrix, v[0], v[1], v[2]);

        var r2 = this.rotate2;
        matrix = m4.xRotate(matrix, r2[0]);
        matrix = m4.yRotate(matrix, r2[1]);
        matrix = m4.zRotate(matrix, r2[2]);

        return matrix;
    },

    buildPosition: function (dynamic) {
        this.position = dynamic.position;
    }

}