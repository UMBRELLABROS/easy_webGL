"use strict";
var Item = function() {
  // attributes
  // uniforms
  this.program;
  this.countIndices;
  this.countElements;
  this.drawKind = DrawKind.TRIANGLE;
  this.activeCamera = null;

  // getter, setter
  this.setProgram = function(newProgram) {
    this.program = newProgram;
  };
  this.getProgram = function() {
    return this.program;
  };

  this.setCountIndices = function(newCount) {
    this.countIndices = newCount;
  };
  this.getCountIndices = function() {
    return this.countIndices;
  };

  this.setCountElements = function(newCount) {
    this.countElements = newCount;
  };
  this.getCountElements = function() {
    return this.countElements;
  };

  this.setDrawKind = function(newDrawKind) {
    this.drawKind = newDrawKind;
  };
  this.getDrawKind = function() {
    return this.drawKind;
  };
};
var ItemService = function() {
  var attributes = [];
  var uniforms = [];
  this.dynamic = new Dynamic();
  this.children = [];
  this.lastObjectMatrix = m4.identity();
  this.physics = null;

  // getter, setter
  this.setAttributes = function(newAttributes) {
    attributes = newAttributes;
  };
  this.getAttributes = function() {
    return attributes;
  };

  this.setUniforms = function(newUniforms) {
    uniforms = newUniforms;
  };
  this.getUniforms = function() {
    return uniforms;
  };

  this.getActualRotation = function() {
    return actualRotation;
  };
  this.setActualRotation = function(newActualRotation) {
    actualRotation = newActualRotation;
  };

  this.equals = function(newItem) {
    var cntFound = 0;
    var newAttributes = newItem.getAttributes();
    this.getAttributes().forEach(attribute => {
      newAttributes.forEach(newAttribute => {
        if (!attribute.equals(newAttribute)) {
          cntFound++;
          return;
        }
      });
    });
    var newUniforms = newItem.getUniforms();
    this.getUniforms().forEach(uniform => {
      newUniforms.forEach(newUniform => {
        if (!uniform.equals(newUniform)) {
          cntFound++;
          return;
        }
      });
    });
    return cntFound > 0 ? false : true;
  };

  this.create = function(prop, lights, cameras) {
    var coords = prop.getCoords();
    var color = prop.getColor();
    var colorArray = prop.getColorArray();
    var position = prop.getPosition();
    var normals = prop.getNormals();
    var indices = prop.getIndices();
    var image = prop.image;
    var uvCoords = prop.uvCoords;
    var geometry = prop.geometry;
    this.physics = prop.physics;
    this.polygons;
    this.sphere;

    prop.children.forEach(prop => {
      var item = new ItemService();
      item.create(prop, lights, cameras);
      this.children.push(item);
    });

    lights.forEach(light => {
      if (light.getKind() == LightKind.DIRECT) {
        var directLight = light.getDirection();
        var directLightUniform = new UniformService();
        directLightUniform.create(
          UniformKind.DIRECTLIGHT,
          "u_direct_direction",
          directLight
        );
        this.getUniforms().push(directLightUniform);
      }
      if (light.getKind() == LightKind.POINT) {
        var lightPosition = light.position;
        var pointLightUniform = new UniformService();
        pointLightUniform.create(
          UniformKind.POINTLIGHT,
          "u_light_position",
          lightPosition
        );
        light.dynamic.position = lightPosition;
        pointLightUniform.dynamic = light.dynamic;
        this.getUniforms().push(pointLightUniform);

        var shininess = prop.shininess;
        if (shininess != null) {
          var shininessUniform = new UniformService();
          shininessUniform.create(
            UniformKind.SHININESS,
            "u_shininess",
            shininess
          );
          this.getUniforms().push(shininessUniform);
        }
      }
    });

    cameras.forEach(camera => {
      this.activeCamera = 0;
      if (camera.kind == CameraKind.MAIN) {
        camera.aspectRatio = Gl.getDisplay()[0] / Gl.getDisplay()[1];
        camera.buildProjectionMatrix();
        var frustumMatrixUniform = new UniformService();
        frustumMatrixUniform.create(
          UniformKind.FRUSTUMMATRIX,
          "u_frustum_matrix",
          camera.frustumMatrix
        );
        this.getUniforms().push(frustumMatrixUniform);
        if (camera.type == CameraKind.MATRIX) {
          var cameraMatrixUniform = new UniformService();
          cameraMatrixUniform.create(
            UniformKind.CAMERAMATRIX,
            "u_camera_matrix",
            camera.cameraMatrix
          );
          this.getUniforms().push(cameraMatrixUniform);
          cameraMatrixUniform.dynamic = camera.dynamic;
        }
        if (camera.type == CameraKind.LOOKAT) {
          var cameraMatrixUniform = new UniformService();
          cameraMatrixUniform.create(
            UniformKind.LOOKATMATRIX,
            "u_camera_lookat",
            camera.cameraMatrix
          );
          this.getUniforms().push(cameraMatrixUniform);
          cameraMatrixUniform.dynamic = camera.dynamic;
        }

        if (
          camera.type == CameraKind.LOOKAT ||
          camera.type == CameraKind.MATRIX
        ) {
          var cameraPositionUniform = new UniformService();
          cameraPositionUniform.create(
            UniformKind.CAMERAPOSITION,
            "u_camera_position",
            camera.position
          );
          cameraPositionUniform.dynamic = camera.dynamic;
          this.getUniforms().push(cameraPositionUniform);
        }
      }
    });

    if (geometry != null) {
      coords = geometry.coords;
      normals = geometry.normals;
      uvCoords = geometry.uvCoords;
      indices = geometry.indices;
      if (this.physics) {
        if (geometry.sphere) {
          this.sphere = geometry.sphere.clone();
        } else {
          this.polygons = [];
          geometry.polygons.forEach(polygon => {
            this.polygons.push(polygon.clone());
          });
        }
      }
    }

    if (coords != null) {
      var coordsAttribute = new AttributeService();
      this.setCountIndices(coords.length / 3);
      coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);
      coordsAttribute.createBuffer();
      this.getAttributes().push(coordsAttribute);
    }

    if (indices != null) {
      var indexAttribute = new AttributeService();
      indexAttribute.create(AttributeKind.INDICES, "a_indices", indices);
      indexAttribute.createBuffer();
      this.getAttributes().push(indexAttribute);
      this.setDrawKind(DrawKind.ELEMENT);
      this.setCountElements(indices.length);
    }

    if (normals != null) {
      var normalAttribute = new AttributeService();
      normalAttribute.create(AttributeKind.NORMALS, "a_normals", normals);
      normalAttribute.createBuffer();
      this.getAttributes().push(normalAttribute);
    }

    if (color != null) {
      var colorUniform = new UniformService();
      colorUniform.create(UniformKind.COLOR, "u_color", color);
      this.getUniforms().push(colorUniform);
    }

    if (colorArray != null) {
      var colorAttribute = new AttributeService();
      colorAttribute.create(AttributeKind.COLOR, "a_color", colorArray);
      colorAttribute.createBuffer();
      colorAttribute.setSize(4); //r,g,b,a
      this.getAttributes().push(colorAttribute);
    }

    if (position != null) {
      var matrixUniform = new UniformService();
      var matrix = m4.identity();
      this.dynamic = prop.dynamic;
      this.dynamic.position = position;
      matrixUniform.create(UniformKind.OBJECTMATRIX, "u_object_matrix", matrix);
      this.getUniforms().push(matrixUniform);
    }

    if (uvCoords != null && image != null) {
      var uvCoordsAttribute = new AttributeService();
      uvCoordsAttribute.create(AttributeKind.UVCOORDS, "a_uv_coords", uvCoords);
      uvCoordsAttribute.createBuffer();
      uvCoordsAttribute.setSize(2); //u,v
      this.getAttributes().push(uvCoordsAttribute);
    }

    if (image != null && uvCoords != null) {
      var texture = new TextureService();
      texture.preLoad();

      var count = texture.count(image);

      var textureUniform = new UniformService();
      textureUniform.textureIndex = count;
      textureUniform.texture = texture.texture;
      textureUniform.create(UniformKind.TEXTURE, "u_texture_" + count, texture);
      this.getUniforms().push(textureUniform);

      texture.load(image);
    }
  };

  this.createProgram = function(newProgram) {
    var program;
    if (newProgram != null) {
      program = newProgram;
    } else {
      var vertexShader = new VertexShaderService(this);
      var vertexShaderCode = vertexShader.getCode();
      var fragmentShader = new FragmentShaderService(this);
      var fragmentShaderCode = fragmentShader.getCode();
      var programService = new ProgramService();
      program = programService.create(vertexShaderCode, fragmentShaderCode);
    }

    this.getAttributes().forEach(attribute => {
      attribute.setLocation(
        Gl.getAttributeLocation(program, attribute.getName())
      );
    });
    this.getUniforms().forEach(uniform => {
      uniform.setLocation(Gl.getUniformLocation(program, uniform.getName()));
    });
    this.setProgram(program);
  };

  this.draw = function(deltaTime, parentMatrix) {
    var objectMatrix = null;
    Gl.useProgram(this.getProgram());

    this.getAttributes().forEach(attribute => {
      attribute.activate();
    });

    this.getUniforms().forEach(uniform => {
      if (uniform.getKind() == UniformKind.OBJECTMATRIX) {
        objectMatrix = this.dynamic.buildMatrix(deltaTime);
        if (parentMatrix) {
          objectMatrix = m4.multiply(parentMatrix, objectMatrix);
        }

        if (this.physics) {
          if (!m4.compareMatrices(objectMatrix, this.lastObjectMatrix)) {
            this.lastObjectMatrix = objectMatrix;
            // sphere or polygon
            if (this.polygons) {
              this.polygons.forEach(polygon => {
                polygon.transformPoints(objectMatrix);
              });
            } else if (this.sphere) {
              this.sphere.center = m4.transformPoint(
                objectMatrix,
                this.sphere.centerBase
              );
            }
          }
        }

        // DEBUG
        // var v = testPoint(matrix, 0, 0, 10, 1);
        // var v1 = [v[0] / v[3], v[1] / v[3], v[2] / v[3]]

        uniform.setValue(objectMatrix);
      }

      if (uniform.getKind() == UniformKind.CAMERAMATRIX) {
        var matrix = uniform.dynamic.buildCameraMatrix();
        uniform.setValue(matrix);
      }
      if (uniform.getKind() == UniformKind.LOOKATMATRIX) {
        var matrix = uniform.dynamic.buildLookAtMatrix();
        uniform.setValue(matrix);
      }

      if (uniform.getKind() == UniformKind.POINTLIGHT) {
        uniform.setValue(uniform.dynamic.position);
      }

      if (uniform.getKind() == UniformKind.CAMERAPOSITION) {
        uniform.setValue(uniform.dynamic.position);
      }

      uniform.activate();
    });

    if (this.getDrawKind() == DrawKind.TRIANGLE) {
      Gl.draw(this.getCountIndices());
    } else {
      Gl.drawElement(this.getCountElements());
    }
    return objectMatrix;
  };
};
ItemService.prototype = new Item();

// Ein Testpunkt, um zusehen, ob er im sichtbaren bereich (-1,1) liegt
function testPoint(a, x, y, z, w) {
  var a00 = a[0 * 4 + 0];
  var a01 = a[0 * 4 + 1];
  var a02 = a[0 * 4 + 2];
  var a03 = a[0 * 4 + 3];
  var a10 = a[1 * 4 + 0];
  var a11 = a[1 * 4 + 1];
  var a12 = a[1 * 4 + 2];
  var a13 = a[1 * 4 + 3];
  var a20 = a[2 * 4 + 0];
  var a21 = a[2 * 4 + 1];
  var a22 = a[2 * 4 + 2];
  var a23 = a[2 * 4 + 3];
  var a30 = a[3 * 4 + 0];
  var a31 = a[3 * 4 + 1];
  var a32 = a[3 * 4 + 2];
  var a33 = a[3 * 4 + 3];
  return [
    a00 * x + a10 * y + a20 * z + +a30 * w,
    a01 * x + a11 * y + a21 * z + +a31 * w,
    a02 * x + a12 * y + a22 * z + +a32 * w,
    a03 * x + a13 * y + a23 * z + +a33 * w
  ];
}
