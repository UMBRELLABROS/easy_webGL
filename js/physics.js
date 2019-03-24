"use strict;";

// DEBUG
var startDebug = false;
var gPlane;

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
        if (element.dynamic.status == DynamicKind.FREE) {
          this.movables.push(element);
        }
      }
    });
  },
  setObstacles: function() {
    this.movables.forEach(movable => {
      this.setMovableObstacles(movable);
    });
  },
  setMovableObstacles: function(movable) {
    movable.polygonObstacles = [];
    movable.sphereObstacles = [];
    var movableDirection = new Geometry.Vector(movable.dynamic.velocity);
    this.items.forEach(obstacle => {
      if (movable != obstacle) {
        if (obstacle.sphere) {
          movable.sphereObstacles.push(obstacle);
        } else {
          // check direction
          // add only polygons
          if (!gPlane) {
            gPlane = new Geometry.Plane(
              obstacle.polygons[0].plane.normal,
              obstacle.polygons[0].plane.c + 0.05
            );
          }
          obstacle.polygons.forEach(polygon => {
            if (polygon.plane.normal.dot(movableDirection) < 0) {
              polygon.rigidity = obstacle.physics.rigidity;
              movable.polygonObstacles.push(polygon);
            }
          });
        }
      }
    });
    // prüfen, ob PLane dabei ist.
    if (movable.physics.id == 3 && movable.dynamic.velocity[1] < 0) {
      if (gPlane && !this.isAbove(gPlane, movable.dynamic.position)) {
        var wwwer = 90;
      }

      var testPlane = false;
      movable.polygonObstacles.forEach(polygon => {
        if (polygon.plane.normal.x == gPlane.normal.x) {
          testPlane = true;
        }
      });
      if (!testPlane) {
        var wwwer = 90;
      }
    }
  },
  checkCollision: function() {
    this.movables.forEach(movable => {
      if (movable.dynamic.status == DynamicKind.FREE) {
        this.checkSingleCollision(movable);
      }
    });
  },
  checkSingleCollision: function(movable) {
    if (movable.physics.id == 3 && imageCounter == 227) {
      var stopFlag = 455;
    }
    movable.polygonObstacles.forEach(polygon => {
      if (movable.sphere) {
        var distanceBefore =
          polygon.plane.normal.dot(
            new Geometry.Vector(movable.dynamic.lastPosition)
          ) -
          polygon.plane.c -
          movable.sphere.radius;
        if (distanceBefore > 0) {
          var distanceAfter =
            polygon.plane.normal.dot(
              new Geometry.Vector(movable.dynamic.position)
            ) -
            polygon.plane.c -
            movable.sphere.radius;

          if (distanceAfter <= 0) {
            if (polygon.surrounds(movable.sphere.center)) {
              this.calcNewDirectionWithPolygon(movable, polygon, distanceAfter);
              this.setMovableObstacles(movable);
              this.checkSingleCollision(movable);
              return;
            }
          }
        }
      } else {
        // polygon
      }
    });
    movable.sphereObstacles.forEach(obstacle => {
      if (movable == obstacle) return;
      if (movable.sphere) {
        var sphere = obstacle.sphere;

        var distanceAfter =
          sphere.center
            .minus(new Geometry.Vector(movable.dynamic.position))
            .length() -
          (movable.sphere.radius + obstacle.sphere.radius);

        if (distanceAfter <= 0) {
          this.calcNewDirectionWithSphere(movable, obstacle, distanceAfter);
          this.setMovableObstacles(movable);
          this.checkSingleCollision(movable);
          return;
        }
      } else {
        // polygon
      }
    });
  },
  calcNewDirectionWithPolygon: function(movable, polygon, distance) {
    if (movable.physics.id == 3) {
      var test = 9;
      if (!this.isAbove(gPlane, movable.dynamic.position)) {
        var newP = 90;
      }
      if (this.isAbove(gPlane, movable.dynamic.lastPosition)) {
        var newP = 91;
      }
    }

    // shift plane by radius
    var plane = new Geometry.Plane(
      polygon.plane.normal,
      polygon.plane.c + movable.sphere.radius
    );
    // velocity
    var vel = new Geometry.Vector(movable.dynamic.velocity);
    var velDistance = vel.dot(plane.normal);
    var newVel = plane.mirrorPoint(vel, velDistance);
    newVel = newVel.times(movable.physics.rigidity * polygon.rigidity);
    movable.dynamic.velocity = newVel.toArray();

    // position
    var pos = new Geometry.Vector(movable.dynamic.position);
    var newPos = plane.mirrorPoint(pos, distance);

    // intersection
    var lastPos = new Geometry.Vector(movable.dynamic.lastPosition);
    var line = new Geometry.Line.fromPoints(lastPos, pos);
    var intersec = plane.intersectLine(line);

    // shorten newPos
    var newLine = new Geometry.Line.fromPoints(intersec, newPos);
    var quant = vel.length() > 0.5 ? 1 : 0.9;
    var dist = newLine.dir.times(
      movable.physics.rigidity * polygon.rigidity * quant
    );
    newPos = newLine.a.plus(dist);
    movable.dynamic.position = newPos.toArray();

    // reset last position
    dist = dist.length();
    var test = newLine.dir.times(dist < 0.001 ? dist / 2 : 0.001);

    var newLastPosition = newLine.a.plus(
      newLine.dir.times(dist < 0.001 ? dist / 2 : 0.001)
    );
    //movable.dynamic.lastPosition = newLastPosition.toArray();

    // both above plane
    var distance1 = plane.normal.dot(newPos) - plane.c;
    var distance2 = plane.normal.dot(newLastPosition) - plane.c;

    if (distance1 < 0 || distance2 < 0) {
      var stop = 9;
    }

    if (movable.physics.id == 3) {
      if (this.isAbove(gPlane, movable.dynamic.position)) {
        var newP = 80;
      }
      if (this.isAbove(gPlane, movable.dynamic.lastPosition)) {
        var newP = 81;
      }
    }

    if (newVel.length() < 0.2 && dist < 0.002) {
      movable.dynamic.status = DynamicKind.STABLE;
    }
  },
  calcNewDirectionWithSphere: function(movable, obstacle, distance) {
    if (movable.physics.id == 3) {
      var test = 9;
      if (this.isAbove(gPlane, movable.dynamic.position)) {
        var newP = 90;
      }
      if (this.isAbove(gPlane, movable.dynamic.lastPosition)) {
        var newP = 91;
      }
    }

    var sphere = obstacle.sphere;
    var s1P = new Geometry.Vector(movable.dynamic.position);
    var s2P = sphere.center;

    // plane
    var normal = s1P.minus(s2P).unit();
    var centerPoint = s2P.plus(
      normal.times(sphere.radius + movable.sphere.radius)
    );
    var plane = new Geometry.Plane(normal, centerPoint.dot(normal));

    var v1 = new Geometry.Vector(movable.dynamic.velocity);
    var v2 = new Geometry.Vector(obstacle.dynamic.velocity);
    var vel1 = this.splitVelocity(v1, plane.normal);
    var vel2 = this.splitVelocity(v2, plane.normal);
    var mass1 = this.createMass(movable, vel1);
    var mass2 = this.createMass(obstacle, vel2);
    var newVels = this.calcElasticCollision(mass1, mass2);

    var dist1 =
      plane.normal.dot(new Geometry.Vector(movable.dynamic.position)) - plane.c;
    var dist2 =
      plane.normal.dot(new Geometry.Vector(movable.dynamic.lastPosition)) -
      plane.c;

    // Plane wird benötigt für die neue Position
    // Beide Kugeln werden geändert
    movable.dynamic.velocity = newVels.v1.toArray();
    if (obstacle.physics.movable) {
      obstacle.dynamic.velocity = newVels.v2.toArray();
      if (obstacle.dynamic.status == DynamicKind.STABLE) {
        obstacle.dynamic.status = DynamicKind.FREE;
      }
    }

    // position
    var pos = new Geometry.Vector(movable.dynamic.position);
    var newPos = plane.mirrorPoint(pos, distance);

    // intersection
    var lastPos = new Geometry.Vector(movable.dynamic.lastPosition);
    var line = new Geometry.Line.fromPoints(lastPos, pos);
    var intersec = plane.intersectLine(line);

    // shorten newPos
    var newLine = new Geometry.Line.fromPoints(intersec, newPos);
    newPos = newLine.a.plus(
      newLine.dir.times(movable.physics.rigidity * obstacle.physics.rigidity)
    );
    movable.dynamic.position = newPos.toArray();

    // reset last position
    var dist = Math.abs(distance);
    var newLastPosition = newLine.a.plus(
      newLine.dir.times(dist < 0.001 ? dist / 2 : 0.001)
    );
    //movable.dynamic.lastPosition = newLastPosition.toArray();

    if (movable.physics.id == 3) {
      if (this.isAbove(gPlane, movable.dynamic.position)) {
        var newP = 90;
      }
      if (this.isAbove(gPlane, movable.dynamic.lastPosition)) {
        var newP = 91;
      }
    }

    if (newVels.v1.length() < 0.2 && dist < 0.002) {
      movable.dynamic.status = DynamicKind.STABLE;
    }
  },
  splitVelocity: function(velocity, normal) {
    // split to normal and tangential
    var velNorm = normal.times(velocity.dot(normal));
    var testNormLen = velNorm.length();
    var velTan = velocity.minus(velNorm);
    var testTanLen = velTan.length();
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
      var v1Norm = a0.plus(a1).minus(mass1.velN);
      var v2Norm = a0.plus(a1).minus(mass2.velN);
      var quant = mass1.velN.length() > 0.5 ? 1 : 0.5;
      var newV1 = v1Norm
        .plus(mass1.velT)
        .times(mass1.rigidity * mass2.rigidity * quant);
      var newV2 = v2Norm
        .plus(mass2.velT)
        .times(mass1.rigidity * mass2.rigidity);
    } else {
      var v1Norm = mass1.velN.times(-1);
      var newV1 = v1Norm
        .plus(mass1.velT)
        .times(mass1.rigidity * mass2.rigidity);
      var newV2 = new Geometry.Vector(0, 0, 0);
    }
    return { v1: newV1, v2: newV2 };
  },
  isAbove: function(plane, p) {
    var dist1 = plane.normal.dot(p) - plane.c;
    return dist1 >= 0;
  }
};
