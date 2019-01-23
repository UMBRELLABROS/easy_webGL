"use strict";
var Item = function () {

    // attributes
    // uniforms
    this.program;
    this.countIndices;
    this.countElements;
    this.drawKind = DrawKind.TRIANGLE;
    this.basePosition = [0, 0, 0];
    this.activeCamera = null;

    // getter, setter
    this.setProgram = function (newProgram) { this.program = newProgram; }
    this.getProgram = function () { return this.program; }

    this.setCountIndices = function (newCount) { this.countIndices = newCount; }
    this.getCountIndices = function () { return this.countIndices; }

    this.setCountElements = function (newCount) { this.countElements = newCount; }
    this.getCountElements = function () { return this.countElements; }

    this.setDrawKind = function (newDrawKind) { this.drawKind = newDrawKind; }
    this.getDrawKind = function () { return this.drawKind; }
}
var ItemService = function () {

    var attributes = [];
    var uniforms = [];
    var actualRotation = [0, 0, 0];

    // getter, setter
    this.setAttributes = function (newAttributes) {
        attributes = newAttributes;
    }
    this.getAttributes = function () { return attributes; }

    this.setUniforms = function (newUniforms) {
        uniforms = newUniforms;
    }
    this.getUniforms = function () { return uniforms; }

    this.getActualRotation = function () { return actualRotation; }
    this.setActualRotation = function (newActualRotation) {
        actualRotation = newActualRotation;
    }


    this.equals = function (newItem) {
        var cntFound = 0
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
            })

        })
        return cntFound > 0 ? false : true;
        // TODO: check uniforms        
    }

    this.create = function (prop, lights, cameras) {
        var coords = prop.getCoords();
        var color = prop.getColor();
        var colorArray = prop.getColorArray();
        var position = prop.getPosition();
        var normals = prop.getNormals();
        var indices = prop.getIndices();
        var image = prop.image;
        var uvCoords = prop.uvCoords;
        var geometry = prop.geometry;
        this.setVelocity = prop.setVelocity;
        this.getVelocity = prop.getVelocity;
        this.setRotation = prop.setRotation;
        this.getRotation = prop.getRotation;

        var directLight = null;
        var lightPosition = null;
        lights.forEach(light => {
            if (light.getKind() == LightKind.DIRECT) {
                directLight = light.getDirection();
            }
            if (light.getKind() == LightKind.POINT) {
                lightPosition = light.position;
            }
        });

        cameras.forEach(camera => {
            this.activeCamera = 0;
            if (camera.kind == CameraKind.MAIN) {
                camera.aspectRatio = Gl.getDisplay()[0] / Gl.getDisplay()[1];
                camera.buildMatrix();
                var frustumMatrixUniform = new UniformService();
                frustumMatrixUniform.create(UniformKind.FRUSTUMMATRIX, "u_frustum_matrix", camera.matrix);
                this.getUniforms().push(frustumMatrixUniform);
            }
        })

        if (geometry != null) {
            coords = geometry.coords;
            normals = geometry.normals;
            uvCoords = geometry.uvCoords;
            indices = geometry.indices;
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

        if (directLight != null) {
            var directLightUniform = new UniformService();
            directLightUniform.create(UniformKind.DIRECTLIGHT, "u_direct_direction", directLight);
            this.getUniforms().push(directLightUniform);
        }

        if (lightPosition != null) {
            var pointLightUniform = new UniformService();
            pointLightUniform.create(UniformKind.POINTLIGHT, "u_light_position", lightPosition);
            this.getUniforms().push(pointLightUniform);
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
            this.basePosition = position;
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

    }

    this.createProgram = function (newProgram) {
        var program;
        if (newProgram != null) {
            program = newProgram;
        }
        else {
            var vertexShader = new VertexShaderService(this);
            var vertexShaderCode = vertexShader.getCode();
            var fragmentShader = new FragmentShaderService(this);
            var fragmentShaderCode = fragmentShader.getCode();
            var programService = new ProgramService();
            program = programService.create(vertexShaderCode, fragmentShaderCode);
        }

        this.getAttributes().forEach(attribute => {
            attribute.setLocation(Gl.getAttributeLocation(program, attribute.getName()));
        });
        this.getUniforms().forEach(uniform => {
            uniform.setLocation(Gl.getUniformLocation(program, uniform.getName()));
        });
        this.setProgram(program);
    }

    this.draw = function () {
        Gl.useProgram(this.getProgram());

        this.getAttributes().forEach(attribute => {
            attribute.activate();
        });

        this.getUniforms().forEach(uniform => {
            if (uniform.getKind() == UniformKind.OBJECTMATRIX) {

                var matrix = m4.identity()
                var p = this.basePosition;
                matrix = m4.translate(matrix, p[0], p[1], p[2]);

                // if (this.activeCamera == null) {
                //     matrix = m4.multiply(m4.projection(Gl.getDisplay()[0], Gl.getDisplay()[1], 100), matrix);
                // }
                // else {
                //     matrix = m4.multiply(this.perspectiveMatrix[this.activeCamera], matrix);
                // }

                var velocity = this.getVelocity();
                matrix = m4.translate(matrix, velocity[0] || 0, velocity[1] || 0, velocity[2] || 0);

                var rotation = this.getRotation();
                var actualRoation = this.getActualRotation();
                actualRoation[0] += rotation[0] || 0;
                actualRoation[1] += rotation[1] || 0;
                actualRoation[2] += rotation[2] || 0;
                matrix = m4.xRotate(matrix, actualRoation[0]);
                matrix = m4.yRotate(matrix, actualRoation[1]);
                matrix = m4.zRotate(matrix, actualRoation[2]);
                this.setActualRotation(actualRoation)

                // DEBUG    
                var v = testPoint(matrix, 0, 0, 10, 1);
                var v1 = [v[0] / v[3], v[1] / v[3], v[2] / v[3]]

                uniform.setValue(matrix);
            }

            uniform.activate();
        });

        if (this.getDrawKind() == DrawKind.TRIANGLE) {
            Gl.draw(this.getCountIndices());
        }
        else {
            Gl.drawElement(this.getCountElements());
        }
    }

}
ItemService.prototype = new Item;


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
    return [a00 * x + a10 * y + a20 * z + +a30 * w,
    a01 * x + a11 * y + a21 * z + +a31 * w,
    a02 * x + a12 * y + a22 * z + +a32 * w,
    a03 * x + a13 * y + a23 * z + +a33 * w];
};



