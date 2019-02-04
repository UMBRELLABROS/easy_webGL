"use strict;";
var Dynamic = function() {
  this.active = false;

  this.position = [0, 0, 0];
  this.orientation = [0, 0, 0];

  this.rotate = [0, 0, 0];
  this.velocity = [0, 0, 0];

  this.rotate2 = [0, 0, 0];

  this.up = [0, 1, 0];
  this.lookAt = [0, 0, 0];
};

Dynamic.prototype = {
  buildMatrix: function() {
    var matrix = m4.identity();

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

  buildPosition: function(dynamic) {
    this.position = dynamic.position;
  },
  buildCameraMatrix: function() {
    var matrix = m4.identity();
    matrix = m4.xRotate(matrix, -this.orientation[0]);
    matrix = m4.yRotate(matrix, -this.orientation[1]);
    matrix = m4.zRotate(matrix, -this.orientation[2]);
    return m4.translate(
      matrix,
      -this.position[0],
      -this.position[1],
      -this.position[2]
    );
  },

  buildLookAtMatrix: function() {
    var position = new VECTOR(this.position);
    var lookAt = new VECTOR(this.lookAt);
    var up = new VECTOR(this.up);
    var zAxis = lookAt.minus(position).unit();
    var xAxis = up.cross(zAxis).unit();
    var yAxis = zAxis.cross(xAxis).unit();

    /*return [
      xAxis.x,
      xAxis.y,
      xAxis.z,
      0,
      yAxis.x,
      yAxis.y,
      yAxis.z,
      0,
      zAxis.x,
      zAxis.y,
      zAxis.z,
      0,
      position.x,
      position.y,
      position.z,
      1
    ];*/
    return [
      xAxis.x,
      yAxis.x,
      zAxis.x,
      0,
      xAxis.y,
      yAxis.y,
      zAxis.y,
      0,
      xAxis.z,
      yAxis.z,
      zAxis.z,
      0,
      -position.x,
      -position.y,
      -position.z,
      1
    ];
  }
};
