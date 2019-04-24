"use strict";
var Director = function() {
  // getter, setter
  this.setGl = function(newGl, width, height) {
    Gl.setGl(newGl, width, height);
  };
};

var DirectorController = function(canvas) {
  var reqFrame;
  var deltaTime = 10;
  var startTime;
  var worlds = [];
  this.setWorlds = function(newWorlds) {
    worlds = newWorlds;
  };
  this.getWorlds = function() {
    return worlds;
  };

  // functions
  this.addScene = function(newScenes) {
    newScenes.forEach(scene => {
      var world = new WorldService();
      world.createItems(scene);
      this.getWorlds().push(world);
    });
  };

  this.action = function() {
    Gl.setDrawModes();
    reqFrame = requestAnimationFrame(renderLoop);
  };

  this.end = function() {
    window.cancelAnimationFrame(reqFrame);
    worlds.forEach(world => {
      world.end();
    });
    worlds = null;
    Gl.gl = null;
  };

  var renderLoop = function(timestamp) {
    if (!startTime) startTime = timestamp;
    var timeLap = timestamp - startTime;
    if (timeLap > deltaTime) {
      render();
      startTime = timestamp;
    }
    reqFrame = requestAnimationFrame(renderLoop);
  };

  var render = function() {
    worlds.forEach(world => {
      world.draw(deltaTime / 1000);
    });
  };

  // constructor
  try {
    var gl = canvas.getContext("webgl");
  } catch (e) {
    alert("Exception init: " + e.toString());
  }
  if (!gl) {
    alert("Unable to create Web GL context");
  }
  this.setGl(gl, canvas.width, canvas.height);
};
DirectorController.prototype = new Director();
