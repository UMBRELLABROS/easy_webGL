"use strict";
var Prop = function() {
  this.normals = null;
  this.indices = null;
  this.image = null;
  this.uvCoords = null;
  this.geometry = null;
};

var PropService = function(newProp) {
  var coords = null;
  var color = null;
  var colorArray = null;
  var position = null;
  var shininess = null;

  this.dynamic = new Dynamic();

  // getter, setter

  this.setCoords = function(newCoords) {
    coords = newCoords;
  };
  this.getCoords = function() {
    return coords;
  };

  this.setPosition = function(newPosition) {
    position = newPosition;
  };
  this.getPosition = function() {
    return position;
  };

  this.getColor = function() {
    return color;
  };
  this.setColor = function(newColor) {
    color = newColor;
  };

  this.getColorArray = function() {
    return colorArray;
  };
  this.setColorArray = function(newColorArray) {
    colorArray = newColorArray;
  };

  this.getNormals = function() {
    return this.normals;
  };
  this.setNormals = function(newNormals) {
    this.normals = newNormals;
  };

  this.getIndices = function() {
    return this.indices;
  };
  this.setIndices = function(newIndices) {
    this.indices = newIndices;
  };

  // constructor
  if (newProp.hasOwnProperty("coords")) {
    this.setCoords(newProp.coords);
  }
  if (newProp.hasOwnProperty("normals")) {
    this.setNormals(newProp.normals);
  }
  if (newProp.hasOwnProperty("indices")) {
    this.setIndices(newProp.indices);
  }
  if (newProp.hasOwnProperty("color")) {
    this.setColor(newProp.color);
  }
  if (newProp.hasOwnProperty("colorArray")) {
    this.setColorArray(newProp.colorArray);
  }
  if (newProp.hasOwnProperty("position")) {
    this.setPosition(newProp.position);
  }
  if (newProp.hasOwnProperty("image")) {
    this.image = newProp.image;
  }
  if (newProp.hasOwnProperty("uvCoords")) {
    this.uvCoords = newProp.uvCoords;
  }
  if (newProp.hasOwnProperty("geometry")) {
    this.geometry = newProp.geometry;
  }
  if (newProp.hasOwnProperty("shininess")) {
    this.shininess = newProp.shininess;
  }
};
PropService.prototype = new Prop();
