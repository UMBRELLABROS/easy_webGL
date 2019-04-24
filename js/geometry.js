"use strict;";
Geometry = function() {
  this.polygons = [];
  this.coords = [];
  this.normals = [];
  this.uvCoords = [];
  this.indices = [];
  this.sphere = null;
};

Geometry.fromPolygons = function(polygons, sphere) {
  var geometry = new Geometry();
  var data = Geometry.buildDataCube(polygons);
  geometry.polygons = polygons;
  geometry.coords = data.coords;
  geometry.normals = data.normals;
  geometry.uvCoords = data.uvCoords;
  geometry.indices = data.indices;
  geometry.sphere = sphere;
  return geometry;
};

Geometry.buildDataCube = function(polygons) {
  var coords = [];
  var normals = [];
  var indices = [];
  var uvCoords = [];
  var o = 0;
  polygons.map(function(polygon) {
    polygon.vertices.forEach(vertex => {
      coords.push(vertex.pos.x, vertex.pos.y, vertex.pos.z);
      normals.push(vertex.normal.x, vertex.normal.y, vertex.normal.z);
      uvCoords.push(vertex.uv.u, vertex.uv.v);
    });
    if (polygon.vertices.length == 4) {
      indices.push(0 + o, 2 + o, 1 + o, 0 + o, 3 + o, 2 + o);
      o += 4;
    } else {
      indices.push(0 + o, 2 + o, 1 + o);
      o += 3;
    }
  });
  return {
    coords: coords,
    normals: normals,
    uvCoords: uvCoords,
    indices: indices
  };
};

Geometry.terrain = function(options) {
  // generate coordinates
  var r = options.radius;
  var rows = options.rows;
  var cols = options.cols;
  var shifts = new Array((rows + 1) * (cols + 1));
  var shP = options.shiftPoints;
  shP.forEach(point => {
    var index = point[0] + point[1] * (rows + 1);
    shifts[index] = new Geometry.Vector(point[2]);
  });
  var polygons = [];

  // set coords
  coords = [];
  for (var y = 0; y <= rows; y++) {
    for (var x = 0; x <= cols; x++) {
      var index = x + y * (rows + 1);
      var v = new Geometry.Vector(
        r * ((2 * x) / cols - 1),
        0,
        r * (-(2 * y) / rows + 1)
      );
      if (shifts[index]) {
        v = v.plus(shifts[index]);
      }
      coords.push(v);
    }
  }

  // generates (rows * cols) tiles with one or two polygons
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var vectors = [0, 2, 3, 1].map(val => {
        return coords[x + !!(val & 2) + (y + !!(val & 1)) * (rows + 1)];
      });
      var even = true;
      vectors.forEach(vector => {
        if (vector.y != 0) even = false;
      });
      var uvs = [0, 2, 3, 1].map(val => {
        return new Geometry.UV(
          (x + !!(val & 2)) / cols,
          (y + !!(val & 1)) / rows
        );
      });
      // calc normals
      var normals = [0, 1, 2, 3].map(index => {
        return vectors[index].getNormal(
          vectors[(index + 1) % 4],
          vectors[(index + 3) % 4]
        );
      });
      // generate tile
      polygons = polygons.concat(
        Geometry.tileSquare(vectors, normals, uvs, even)
      );
    }
  }
  return Geometry.fromPolygons(polygons, null);
};

Geometry.tileSquare = function(vectors, normals, uvs, even) {
  var polygons = [];
  if (even) {
    var vertices = [0, 1, 2, 3].map(index => {
      return new Geometry.Vertex(vectors[index], normals[index], uvs[index]);
    });
    polygons.push(new Geometry.Polygon(vertices, null));
  } else {
    var vertices = [0, 1, 3].map(index => {
      return new Geometry.Vertex(vectors[index], normals[index], uvs[index]);
    });
    polygons.push(new Geometry.Polygon(vertices, null));
    vertices = [1, 2, 3].map(index => {
      return new Geometry.Vertex(vectors[index], normals[index], uvs[index]);
    });
    polygons.push(new Geometry.Polygon(vertices, null));
  }
  return polygons;
};

Geometry.plane = function(options) {
  options = options || {};
  var c = new Geometry.Vector(options.center || [0, 0, 0]);
  var r = !options.radius
    ? [1, 1, 1]
    : options.radius.length
    ? options.radius
    : [options.radius, options.radius, options.radius];
  return Geometry.fromPolygons(
    [
      [[2, 6, 7, 3], [0, +1, 0], [1, 0, 2, 3]]
      // [[4, 0, 1, 5], [0, -1, 0], [1, 0, 2, 3]]
    ].map(function(info) {
      return new Geometry.Polygon(
        info[0].map(function(i, id) {
          var pos = new Geometry.Vector(
            c.x + r[0] * (2 * !!(i & 1) - 1),
            0,
            c.z + r[2] * (2 * !!(i & 4) - 1)
          );
          var uv = new Geometry.UV(
            1 * !!(info[2][id] & 2),
            1 * !!(info[2][id] & 1)
          );
          return new Geometry.Vertex(pos, new Geometry.Vector(info[1]), uv);
        })
      );
    }),
    null
  );
};

Geometry.cube = function(options) {
  options = options || {};
  var c = new Geometry.Vector(options.center || [0, 0, 0]);
  var r = !options.radius
    ? [1, 1, 1]
    : options.radius.length
    ? options.radius
    : [options.radius, options.radius, options.radius];
  return Geometry.fromPolygons(
    [
      [[4, 6, 2, 0], [-1, 0, 0], [1, 0, 2, 3]],
      [[1, 3, 7, 5], [+1, 0, 0], [1, 0, 2, 3]],
      [[4, 0, 1, 5], [0, -1, 0], [1, 0, 2, 3]],
      [[2, 6, 7, 3], [0, +1, 0], [1, 0, 2, 3]],
      [[0, 2, 3, 1], [0, 0, -1], [1, 0, 2, 3]],
      [[5, 7, 6, 4], [0, 0, +1], [1, 0, 2, 3]]
    ].map(function(info) {
      return new Geometry.Polygon(
        info[0].map(function(i, id) {
          var pos = new Geometry.Vector(
            c.x + r[0] * (2 * !!(i & 1) - 1),
            c.y + r[1] * (2 * !!(i & 2) - 1),
            c.z + r[2] * (2 * !!(i & 4) - 1)
          );
          var uv = new Geometry.UV(
            1 * !!(info[2][id] & 2),
            1 * !!(info[2][id] & 1)
          );
          return new Geometry.Vertex(pos, new Geometry.Vector(info[1]), uv);
        })
      );
    }),
    null
  );
};

Geometry.sphere = function(options) {
  options = options || {};
  var c = new Geometry.Vector(options.center || [0, 0, 0]);
  var r = options.radius || 1;
  var slices = options.slices || 16;
  var stacks = options.stacks || 8;
  var polygons = [],
    vertices;

  function vertex(theta, phi) {
    var u = theta;
    var v = phi;
    theta *= Math.PI * 2;
    phi *= Math.PI;
    var dir = new Geometry.Vector(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi)
    );
    var uv = new Geometry.UV(u, v);
    vertices.push(new Geometry.Vertex(c.plus(dir.times(r)), dir, uv));
  }

  for (var i = 0; i < slices; i++) {
    for (var j = 0; j < stacks; j++) {
      vertices = [];
      vertex(i / slices, j / stacks);
      if (j > 0) vertex((i + 1) / slices, j / stacks);
      if (j < stacks - 1) vertex((i + 1) / slices, (j + 1) / stacks);
      vertex(i / slices, (j + 1) / stacks);
      polygons.push(new Geometry.Polygon(vertices));
    }
  }
  return Geometry.fromPolygons(polygons, new Geometry.Sphere(c, r));
};

Geometry.UV = function(u, v) {
  if (arguments.length == 2) {
    this.u = u;
    this.v = v;
  } else if ("u" in u) {
    this.u = u.u;
    this.v = u.v;
  } else {
    this.u = u[0];
    this.v = u[1];
  }
};

Geometry.Vector = function(x, y, z) {
  if (arguments.length == 3) {
    this.x = x;
    this.y = y;
    this.z = z;
  } else if ("x" in x) {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z;
  } else {
    this.x = x[0];
    this.y = x[1];
    this.z = x[2];
  }
};

Geometry.Vector.prototype = {
  clone: function() {
    return new Geometry.Vector(this.x, this.y, this.z);
  },

  negated: function() {
    return new Geometry.Vector(-this.x, -this.y, -this.z);
  },

  plus: function(a) {
    return new Geometry.Vector(this.x + a.x, this.y + a.y, this.z + a.z);
  },

  minus: function(a) {
    return new Geometry.Vector(this.x - a.x, this.y - a.y, this.z - a.z);
  },

  times: function(a) {
    return new Geometry.Vector(this.x * a, this.y * a, this.z * a);
  },

  dividedBy: function(a) {
    return new Geometry.Vector(this.x / a, this.y / a, this.z / a);
  },

  dot: function(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  },

  lerp: function(a, t) {
    return this.plus(a.minus(this).times(t));
  },

  length: function() {
    return Math.sqrt(this.dot(this));
  },

  unit: function() {
    return this.dividedBy(this.length());
  },

  cross: function(a) {
    return new Geometry.Vector(
      this.y * a.z - this.z * a.y,
      this.z * a.x - this.x * a.z,
      this.x * a.y - this.y * a.x
    );
  },

  getNormal: function(a, b) {
    return b
      .minus(this)
      .cross(a.minus(this))
      .unit();
  },

  toArray: function() {
    return [this.x, this.y, this.z];
  }
};

Geometry.Vertex = function(pos, normal, uv) {
  this.pos = new Geometry.Vector(pos);
  this.normal = new Geometry.Vector(normal);
  this.uv = new Geometry.UV(uv);
};
Geometry.Vertex.prototype = {
  clone: function() {
    var pos = new Geometry.Vector(this.pos);
    var normal = new Geometry.Vector(this.normal);
    var uv = new Geometry.UV(this.uv);
    return new Geometry.Vertex(pos, normal, uv);
  }
};

Geometry.Line = function(a, dir) {
  this.a = a;
  this.dir = dir;
};
Geometry.Line.fromPoints = function(a, b) {
  this.a = a;
  this.dir = b.minus(a);
};

Geometry.Plane = function(normal, c) {
  this.normal = normal;
  this.c = c;
};
Geometry.Plane.prototype = {
  intersectLine: function(line) {
    var t0 = this.c - line.a.dot(this.normal);
    t0 /= this.normal.dot(line.dir);
    return line.a.plus(line.dir.times(t0));
  },
  mirrorPoint: function(p, distance) {
    return p.plus(this.normal.times(-2 * distance));
  }
};

Geometry.Plane.fromPoints = function(a, b, c) {
  var n = b
    .minus(a)
    .cross(c.minus(a))
    .unit();
  return new Geometry.Plane(n, n.dot(a));
};

Geometry.Polygon = function(vertices, shared) {
  this.vertices = vertices;
  this.verticesBase = vertices;
  this.shared = shared;
  this.plane = Geometry.Plane.fromPoints(
    vertices[0].pos,
    vertices[1].pos,
    vertices[2].pos
  );
};

Geometry.Polygon.prototype = {
  clone: function() {
    var vertices = [];
    this.vertices.forEach(vertex => {
      vertices.push(vertex.clone());
    });
    return new Geometry.Polygon(vertices, this.shared);
  },
  surrounds: function(point) {
    var l = this.vertices.length;
    for (var i = 0; i < l; i++) {
      var v1 = this.vertices[i].pos;
      var v2 = this.vertices[(i + 1) % l].pos;
      var nl = v2
        .minus(v1)
        .cross(this.plane.normal)
        .unit();
      var c = nl.dot(v1);
      if (c - nl.dot(point) < 0) return false;
    }
    return true;
  },
  transformPoints: function(objectMatrix) {
    for (var i = 0; i < this.vertices.length; i++) {
      this.vertices[i].pos = m4.transformPoint(
        objectMatrix,
        this.verticesBase[i].pos
      );
      this.vertices[i].normal = m4.rotatePoint(
        objectMatrix,
        this.verticesBase[i].normal
      );
    }
    this.plane = Geometry.Plane.fromPoints(
      this.vertices[0].pos,
      this.vertices[1].pos,
      this.vertices[2].pos
    );
  }
};

Geometry.Sphere = function(center, radius) {
  this.center = center;
  this.centerBase = center;
  this.radius = radius;
};
Geometry.Sphere.prototype = {
  clone: function() {
    return new Geometry.Sphere(this.center, this.radius);
  }
};
