"use strict;"
var Dynamic = function () {
    this.active = false;
    this.rotate = [0, 0, 0];
    this.translate = [0, 0, 0];
    this.rotate2 = [0, 0, 0];
    this.velocity = [0, 0, 0];
    this.rotation = [0, 0, 0];
}

Dynamic.prototype = {

    buildMatrix: function (newPosition, newRotation) {
        var matrix = m4.identity()

        var p = newPosition;
        matrix = m4.translate(matrix, p[0], p[1], p[2]);

        var rotation = newRotation;
        var actualRoation = this.rotate;
        actualRoation[0] += rotation[0];
        actualRoation[1] += rotation[1];
        actualRoation[2] += rotation[2];
        matrix = m4.xRotate(matrix, actualRoation[0]);
        matrix = m4.yRotate(matrix, actualRoation[1]);
        matrix = m4.zRotate(matrix, actualRoation[2]);
        this.rotate = actualRoation;
        return matrix;
    },
    buildPosition: function (newPosition) {
        this.translate = newPosition;
    }

}