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
    this.getItems().forEach(item => {
      if (item.physics && item.physics.movable) {
        this.getItems().forEach(item2 => {
          if (item2.physics && item != item2) {
            if (item.sphere && !item2.sphere) {
              var polygon = item2.polygons[0];

              var distance =
                polygon.plane.normal.dot(item.sphere.center) - polygon.plane.c;

              if (distance < item.sphere.radius) {
                var delta = item.sphere.radius - distance;
                // turn velovity
                var vel = new Geometry.Vector(item.dynamic.velocity);
                // calculate new direction
                var mult = vel.times(-1).dot(polygon.plane.normal);
                var newVel = polygon.plane.normal.times(2 * mult).plus(vel);
                newVel = newVel.times(
                  item.physics.elastic * item2.physics.elastic
                );
                var newDir = newVel.unit();
                var newPos = newDir.times(delta);

                item.dynamic.velocity = [newVel.x, newVel.y, newVel.z];
                var pos = item.dynamic.position;
                item.dynamic.position = [
                  pos[0] + newPos.x,
                  pos[1] + newPos.y,
                  pos[2] + newPos.z
                ];
              }
            }
          }
        });
      }
    });
  };

  this.drawChild = function(item, parentMatrix) {
    item.children.forEach(child => {
      var matrix = child.draw(deltaTime, parentMatrix);
      this.drawChild(child, matrix);
    });
  };
};
WorldService.prototype = new World();
