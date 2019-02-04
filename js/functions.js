"use strict";
function d() {
  return document;
}
function $(id) {
  return d().getElementById(id);
}
function dcE(element) {
  return d().createElement(element);
}
function isPowerOf2(n) {
  return (n & (n - 1)) == 0;
}

Array.prototype.equals = function(array) {
  if (!array) return false;
  if (this.length != array.length) return false;
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] != array[i]) return false;
  }
  return true;
};

Float32Array.prototype.equals = function(array) {
  if (!array) return false;
  if (this.length != array.length) return false;
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] != array[i]) return false;
  }
  return true;
};

Uint16Array.prototype.equals = function(array) {
  if (!array) return false;
  if (this.length != array.length) return false;
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] != array[i]) return false;
  }
  return true;
};

var AttributeKind = Object.freeze({
  NONE: 0,
  COORDS: 1,
  COLOR: 2,
  NORMALS: 3,
  INDICES: 4,
  UVCOORDS: 5
});
var UniformKind = Object.freeze({
  NONE: 0,
  COLOR: 1,
  OBJECTMATRIX: 2,
  FRUSTUMMATRIX: 3,
  CAMERAMATRIX: 4,
  LOOKATMATRIX: 5,
  TEXTURE: 6,
  DIRECTLIGHT: 7,
  POINTLIGHT: 8
});
var LightKind = Object.freeze({
  NONE: 0,
  DIRECT: 1,
  POINT: 2
});
var CameraKind = Object.freeze({
  NONE: 0,
  MAIN: 1,
  SECOND: 2,
  MATRIX: 3,
  LOOKAT: 4
});
var DrawKind = Object.freeze({ TRIANGLE: 0, ELEMENT: 1 });
var ShaderKind = Object.freeze({ VERTEX: 0, FRAGMENT: 1 });
var TargetKind = Object.freeze({ ARRAY_BUFFER: 0, ELEMENT_ARRAY_BUFFER: 1 });
