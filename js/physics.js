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
                polygon.rigidity = obstacle.physics.rigidity;
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
    newVel = newVel.times(movable.physics.rigidity * polygon.rigidity);
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

    var v1 = new Geometry.Vector(movable.dynamic.velocity);
    var v2 = new Geometry.Vector(obstacle.dynamic.velocity);
    var vel1 = this.splitVelocity(v1, planeN);
    var vel2 = this.splitVelocity(v2, planeN);
    var mass1 = this.createMass(movable, vel1);
    var mass2 = this.createMass(obstacle, vel2);
    var newVel = this.calcElasticCollision(mass1, mass2);

    // Plane wird benötigt für die neue Position
    // Beide Kugeln werden geändert
    movable.dynamic.velocity = newVel.v1.toArray();
    obstacle.dynamic.velocity = newVel.v2.toArray();
    if (
      obstacle.dynamic.status == DynamicKind.STABLE &&
      newVel.v2.length() > 0.0
    ) {
      obstacle.dynamic.status = DynamicKind.FREE;
    }

    var newPos = planeN.times(2 * distance);

    var pos = movable.dynamic.position;
    movable.dynamic.position = [
      pos[0] + newPos.x,
      pos[1] + newPos.y,
      pos[2] + newPos.z
    ];
  },
  splitVelocity: function(velocity, normal) {
    // split to normal and tangential
    var velNorm = normal.times(velocity.dot(normal));
    var velTan = velocity.minus(velNorm);
    return { n: velNorm, t: velTan };
  },
  createMass: function(movable, velocity) {
    return {
      m: movable.physics.weight,
      velN: velocity.n,
      velT: velocity.t,
      rigidity: movable.physics.rigidity,
      movable: movable.physics.movable
    };
  },
  calcElasticCollision: function(mass1, mass2) {
    // mass can be movable = false
    if (mass2.movable) {
      var a0 = mass1.velN.times((2 * mass1.m) / (mass1.m + mass2.m));
      var a1 = mass2.velN.times((2 * mass2.m) / (mass1.m + mass2.m));
      var v1s = a0.plus(a1).minus(mass1.velN);
      var v2s = a0.plus(a1).minus(mass2.velN);
      var newV1 = v1s.plus(mass1.velT).times(mass1.rigidity * mass2.rigidity);
      var newV2 = v2s.plus(mass1.velT).times(mass1.rigidity * mass2.rigidity);
    } else {
      var v1s = mass1.velN.times(-1);
      var newV1 = v1s.plus(mass1.velT).times(mass1.rigidity * mass2.rigidity);
      var newV2 = new Geometry.Vector(0, 0, 0);
    }
    return { v1: newV1, v2: newV2 };
  }
};
