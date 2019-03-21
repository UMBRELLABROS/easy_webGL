"use strict";
var World = function() {};

var WorldService = function() {
  var items = [];
  this.compareItems = [];

  // getter, setter
  this.getItems = function() {
    return items;
  };
  this.setItems = function(newItems) {
    items = newItems;
  };

  this.createItems = function(newScene) {
    // build items from scene
    var props = newScene.getProps();
    var lights = newScene.getLights();
    var cameras = newScene.getCameras();

    props.forEach(prop => {
      var item = new ItemService();
      item.create(prop, lights, cameras);
      var program = this.getProgram(this.getItems(), item);
      item.createProgram(program);
      this.getItems().push(item);
      this.getChildProgram(item.children);
    });
  };

  this.getChildProgram = function(children) {
    children.forEach(child => {
      var program = this.getProgram(this.getItems(), child);
      child.createProgram(program);
      this.getChildProgram(child.children);
    });
  };

  this.getProgram = function(items, newItem) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].equals(newItem)) {
        return items[i].getProgram();
      }
    }
    return null;
  };

  this.draw = function(deltaTime) {
    this.getItems().forEach(item => {
      var matrix = item.draw(deltaTime, null);
      this.drawChild(item, matrix);
    });
    // physics
    if (imgFlag) {
      imageCounter++;
      if (imageCounter == 227) {
        var stopFlag = 130;
      }
    }
    var physic = new Physics(this.getItems());
    physic.setMovables();
    physic.setObstacles();
    physic.checkCollision();
    if (gPlane) {
      var id = items[5].physics.id;
      if (
        !physic.isAbove(gPlane, new Geometry.Vector(items[5].dynamic.position))
      ) {
        var stopFlag = 120;
      }
    }
    physic = null;
  };

  this.drawChild = function(item, parentMatrix) {
    item.children.forEach(child => {
      var matrix = child.draw(deltaTime, parentMatrix);
      this.drawChild(child, matrix);
    });
  };
};
WorldService.prototype = new World();
