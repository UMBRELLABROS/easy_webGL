"use strict;";
var Physics = function(items) {
  this.items = [];
  this.movables = [];

  items.forEach(element => {
    if (element.physics) {
      this.items.push(element);
    }
  });
};

Physics.prototype = {
  setMovables: function() {
    this.items.forEach(element => {
      if (element.physics.movable) {
        element.polygonObstacles = [];
        element.sphereObstacles = [];
        this.movables.push(element);
      }
    });
  },
  setObstacles: function() {
    this.movables.forEach(movable => {
      //movable.dynamic.grounded = false;
      var movableDirection = new Geometry.Vector(movable.dynamic.velocity);
      this.items.forEach(obstacle => {
        if (movable != obstacle) {
          if (obstacle.sphere) {
            movable.sphereObstacles.push(obstacle.sphere);
          } else {
            // prüfen, ob die Richtung stimmt
            // nur polygone hinzufügen
            obstacle.polygons.forEach(polygon => {
              if (polygon.plane.normal.dot(movableDirection) < 0) {
                movable.polygonObstacles.push(polygon);
              }
            });
          }
        }
      });
    });
  },
  checkCollision: function() {
    this.movables.forEach(movable => {
      movable.polygonObstacles.forEach(polygon => {
        if (movable.sphere) {
          var distanceBefore =
            polygon.plane.normal.dot(
              new Geometry.Vector(movable.dynamic.lastPosition)
            ) -
            polygon.plane.c -
            movable.sphere.radius;
          var distanceAfter =
            polygon.plane.normal.dot(
              new Geometry.Vector(movable.dynamic.position)
            ) -
            polygon.plane.c -
            movable.sphere.radius;
          $("debug").innerHTML = distanceBefore + "<br>" + distanceAfter;
          if (distanceBefore * distanceAfter <= 0) {
            var distance = Math.abs(distanceAfter);
            if (polygon.isInside(movable.sphere.center)) {
              this.calcNewDirectionWithPolygon(movable, polygon, distance);
            }
          }
        } else {
          // polygon
        }
      });
    });
  },
  calcNewDirectionWithPolygon: function(movable, polygon, distance) {
    // turn velovity
    var vel = new Geometry.Vector(movable.dynamic.velocity);
    // calculate new direction / vel
    var mult = vel.times(-1).dot(polygon.plane.normal);
    var newVel = polygon.plane.normal.times(2 * mult).plus(vel);

    var newDir = newVel.unit();
    var newPos = newDir.times(2 * distance);

    var pos = movable.dynamic.position;
    movable.dynamic.position = [
      pos[0] + newPos.x,
      pos[1] + newPos.y,
      pos[2] + newPos.z
    ];
    newVel = newVel.times(movable.physics.elastic * movable.physics.elastic);
    movable.dynamic.velocity = [newVel.x, newVel.y, newVel.z];

    if (newVel.length() < 0.1 && Math.abs(distance) < 0.001) {
      movable.dynamic.status = DynamicKind.STABLE;
    }
    var distanceAfter =
      polygon.plane.normal.dot(new Geometry.Vector(movable.dynamic.position)) -
      polygon.plane.c -
      movable.sphere.radius;
    // abfrage ist punkt unterhalb des polygons?
    // Und v zeigt davon weg
    var error;
    var vDir = newVel.dot(polygon.plane.normal);
    if (vDir < 0) {
      error = true;
    }
    if (distanceAfter < 0) {
      error = true;
    }
    if (newVel.length() < 0.1) {
      error = true;
    }
    // und ist größer als a*dt!!!!
    // ###
  }
};
