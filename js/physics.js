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
            movable.sphereObstacles.push(obstacle);
          } else {
            // prüfen, ob die Richtung stimmt
            // nur polygone hinzufügen
            obstacle.polygons.forEach(polygon => {
              if (polygon.plane.normal.dot(movableDirection) < 0) {
                polygon.elastic = obstacle.physics.elastic;
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
      movable.sphereObstacles.forEach(obstacle => {
        if (movable.sphere) {
          var sphere = obstacle.sphere;
          var distanceBefore =
            sphere.center
              .minus(new Geometry.Vector(movable.dynamic.lastPosition))
              .length() -
            2 * movable.sphere.radius;
          var distanceAfter =
            sphere.center
              .minus(new Geometry.Vector(movable.dynamic.position))
              .length() -
            2 * movable.sphere.radius;
          if (distanceBefore * distanceAfter <= 0) {
            var distance = Math.abs(distanceAfter);
            this.calcNewDirectionWithSphere(movable, obstacle, distance);
          }
        } else {
          // polygon
        }
      });
    });
  },
  calcNewDirectionWithPolygon: function(movable, polygon, distance) {
    var vel = new Geometry.Vector(movable.dynamic.velocity);
    var mult = vel.times(-1).dot(polygon.plane.normal);
    var newVel = polygon.plane.normal.times(2 * mult).plus(vel);
    var newPos = polygon.plane.normal.times(2 * distance);

    var pos = movable.dynamic.position;
    movable.dynamic.position = [
      pos[0] + newPos.x,
      pos[1] + newPos.y,
      pos[2] + newPos.z
    ];
    newVel = newVel.times(movable.physics.elastic * polygon.elastic);
    movable.dynamic.velocity = [newVel.x, newVel.y, newVel.z];

    if (newVel.length() < 0.2 && Math.abs(distance) < 0.001) {
      movable.dynamic.status = DynamicKind.STABLE;
    }
  },
  calcNewDirectionWithSphere: function(movable, obstacle, distance) {
    var sphere = obstacle.sphere;
    var s1P = new Geometry.Vector(movable.dynamic.position);
    var s2P = sphere.center;
    var planeN = s1P.minus(s2P).unit();
    var planeC = s1P
      .plus(s2P)
      .times(0.5)
      .dot(planeN);

    // falls obstacle auch movable

    // v1' =  2*(m1v1+m2v2)/(m1+m2)-v1
    // v2' =  2*(m1v1+m2v2)/(m1+m2)-v2
    var m1 = movable.physics.weight;
    var m2 = obstacle.physics.weight;
    var v1 = new Geometry.Vector(movable.dynamic.velocity);
    var v2 = new Geometry.Vector(obstacle.dynamic.velocity);
    var vel1 = this.splitVelocity(v1, planeN);
    var vel2 = this.splitVelocity(v2, planeN);
    var newVel = this.getNewVelocity(
      vel1.n,
      vel1.t,
      vel2.n,
      vel2.t,
      m1,
      m2,
      movable.physics.elastic,
      obstacle.physics.elastic
    );

    var a0 = v1.times((2 * m1) / (m1 + m2));
    var a1 = v2.times((2 * m2) / (m1 + m2));
    var v1s = a0.plus(a1).minus(v1);
    var v2s = a0.plus(a1).minus(v2);

    //  Plane wird benötigt für die neue Position
    // Beide Kugeln werden geändert

    var vel = new Geometry.Vector(movable.dynamic.velocity);
    var mult = vel.times(-1).dot(planeN);
    var newVel = planeN.times(2 * mult).plus(vel);
    var newPos = planeN.times(2 * distance);
    newVel = newVel.times(movable.physics.elastic * obstacle.physics.elastic);
    movable.dynamic.velocity = [newVel.x, newVel.y, newVel.z];
    var pos = movable.dynamic.position;
    movable.dynamic.position = [
      pos[0] + newPos.x,
      pos[1] + newPos.y,
      pos[2] + newPos.z
    ];
  },
  splitVelocity: function(velocity, normal) {
    // split to normal and tangential
    velNorm = normal.times(velocity.dot(normal));
    velTan = velocity.minus(velNorm);
    return { n: velNorm, t: velTan };
  },
  getNewVelocity: function(v1, vt1, v2, vt2, m1, m2, red1, red2) {
    var a0 = v1.times((2 * m1) / (m1 + m2));
    var a1 = v2.times((2 * m2) / (m1 + m2));
    var v1s = a0.plus(a1).minus(v1);
    var v2s = a0.plus(a1).minus(v2);
    var newV1 = v1s.plus(vt1).times(red1 * red2);
    var newV2 = v2s.plus(vt2).times(red1 * red2);
    return { v1s: newV1, v2s: newV2 };
  }
};
