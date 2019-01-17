"use strict;"
Geometry = function () {
  this.polygons = [];
  this.coords = [];
  this.normals = [];
  this.uvCoords = [];
  this.indices = [];
};

Geometry.fromPolygons = function (polygons) {
  var geometry = new Geometry();
  var data = Geometry.buildData(polygons);
  geometry.polygons = polygons;
  geometry.coords = data.coords;
  geometry.normals = data.normals;
  geometry.uvCoords = data.uvCoords;
  geometry.indices = data.indices;
  return geometry;
};


Geometry.buildData = function (polygons) {
  var coords = [];
  var normals = [];
  var indices = [];
  var uvCoords = [];
  var o = 0;
  polygons.map(function (polygon) {
    polygon.vertices.forEach(vertex => {
      coords.push(vertex.pos.x, vertex.pos.y, vertex.pos.z);
      normals.push(vertex.normal.x, vertex.normal.y, vertex.normal.z);
      uvCoords.push(vertex.uv.u, vertex.uv.v);
    });
    indices.push(0 + o, 2 + o, 1 + o,
      0 + o, 3 + o, 2 + o);
    o += 4;
  });
  return {
    coords: coords,
    normals: normals,
    uvCoords: uvCoords,
    indices: indices
  }
}


Geometry.cube = function (options) {
  options = options || {};
  var c = new Geometry.Vector(options.center || [0, 0, 0]);
  var r = !options.radius ? [1, 1, 1] : options.radius.length ?
    options.radius : [options.radius, options.radius, options.radius];
  return Geometry.fromPolygons([
    [[4, 6, 2, 0], [-1, 0, 0], [1, 0, 2, 3]],
    [[1, 3, 7, 5], [+1, 0, 0], [1, 0, 2, 3]],
    [[4, 0, 1, 5], [0, -1, 0], [1, 0, 2, 3]],
    [[2, 6, 7, 3], [0, +1, 0], [1, 0, 2, 3]],
    [[0, 2, 3, 1], [0, 0, -1], [1, 0, 2, 3]],
    [[5, 7, 6, 4], [0, 0, +1], [1, 0, 2, 3]]
  ].map(function (info) {
    return new Geometry.Polygon((info[0]).map(function (i, id) {
      var pos = new Geometry.Vector(
        c.x + r[0] * (2 * !!(i & 1) - 1),
        c.y + r[1] * (2 * !!(i & 2) - 1),
        c.z + r[2] * (2 * !!(i & 4) - 1)
      );
      var uv = new Geometry.UV(
        1 * !!(info[2][id] & 2), 1 * !!(info[2][id] & 1)
      );
      return new Geometry.Vertex(pos,
        new Geometry.Vector(info[1]), uv);
    }));
  }));
};

Geometry.UV = function (u, v) {
  if (arguments.length == 2) {
    this.u = u;
    this.v = v;
  } else if ('u' in u) {
    this.u = u.u;
    this.v = u.v;
  } else {
    this.u = u[0];
    this.v = u[1];
  }
};

Geometry.Vector = function (x, y, z) {
  if (arguments.length == 3) {
    this.x = x;
    this.y = y;
    this.z = z;
  } else if ('x' in x) {
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
  clone: function () {
    return new Geometry.Vector(this.x, this.y, this.z);
  },

  negated: function () {
    return new Geometry.Vector(-this.x, -this.y, -this.z);
  },

  plus: function (a) {
    return new Geometry.Vector(this.x + a.x, this.y + a.y, this.z + a.z);
  },

  minus: function (a) {
    return new Geometry.Vector(this.x - a.x, this.y - a.y, this.z - a.z);
  },

  times: function (a) {
    return new Geometry.Vector(this.x * a, this.y * a, this.z * a);
  },

  dividedBy: function (a) {
    return new Geometry.Vector(this.x / a, this.y / a, this.z / a);
  },

  dot: function (a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  },

  lerp: function (a, t) {
    return this.plus(a.minus(this).times(t));
  },

  length: function () {
    return Math.sqrt(this.dot(this));
  },

  unit: function () {
    return this.dividedBy(this.length());
  },

  cross: function (a) {
    return new Geometry.Vector(
      this.y * a.z - this.z * a.y,
      this.z * a.x - this.x * a.z,
      this.x * a.y - this.y * a.x
    );
  }
};

Geometry.Vertex = function (pos, normal, uv) {
  this.pos = new Geometry.Vector(pos);
  this.normal = new Geometry.Vector(normal);
  this.uv = new Geometry.UV(uv);
};

Geometry.Plane = function (normal, w) {
  this.normal = normal;
  this.w = w;
};

Geometry.Plane.fromPoints = function (a, b, c) {
  var n = b.minus(a).cross(c.minus(a)).unit();
  return new Geometry.Plane(n, n.dot(a));
};

Geometry.Polygon = function (vertices, shared) {
  this.vertices = vertices;
  this.shared = shared;
  this.plane = Geometry.Plane.fromPoints(vertices[0].pos, vertices[1].pos, vertices[2].pos);
};

