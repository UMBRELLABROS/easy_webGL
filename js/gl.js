"use strict";
var Gl = {
    gl: null,
    displayWidth: 0,
    displayHeight: 0,
    displayDepth: 0,
    program: null,
    attributes: [],

    // getter, setter
    setGl: function (newGl, width, height) {
        this.gl = newGl;
        this.displayWidth = width;
        this.displayHeight = height;
    },

    getDisplay: function () {
        return [this.displayWidth,
        this.displayHeight,
        this.displayDepth];
    },

    // functions
    createShader: function (shaderType, shaderCode) {
        var shader = this.gl.createShader(
            shaderType == ShaderKind.VERTEX ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER
        );
        this.gl.shaderSource(shader, shaderCode);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw "Error in shader:" + shaderType + this.gl.getShaderInfoLog(shader);
        }

        var source = this.gl.getShaderSource(shader);
        return shader;
    },

    createProgram: function (vertexShader, fragmentShader) {
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw ("Error in program:" + this.gl.getProgramInfoLog(program));
        }
        return program;
    },

    getTarget: function (newTarget) {
        var target = this.gl.ARRAY_BUFFER;
        if (newTarget == TargetKind.ELEMENT_ARRAY_BUFFER) {
            target = this.gl.ELEMENT_ARRAY_BUFFER;
        }
        return target;
    },

    createBuffer: function (attribute) {
        var foundAttribute = null;
        this.getAttributes().forEach(localAttribute => {
            if (attribute.equals(localAttribute) &&
                attribute.getSrcData().equals(localAttribute.getSrcData())) {
                foundAttribute = localAttribute;
                return;
            }
        });
        if (foundAttribute != null)
            return foundAttribute.getBuffer();

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(attribute.getTarget(), buffer);
        this.gl.bufferData(attribute.getTarget(), attribute.getSrcData(), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(attribute.getTarget(), null);
        this.getAttributes().push(attribute);

        return buffer;
    },

    getAttributes: function () {
        return this.attributes;
    },

    getAttributeLocation: function (program, name) {
        return this.gl.getAttribLocation(program, name);
    },

    useProgram: function (newProgram) {
        if (newProgram != this.program) {
            this.program = newProgram;
            this.gl.useProgram(this.program);
        }
    },

    activateAttribute: function (attribute) {
        if (attribute.getKind() == AttributeKind.INDICES) {
            this.gl.bindBuffer(attribute.getTarget(), attribute.getBuffer());
        }
        else {
            var location = attribute.getLocation();
            if (location < 0) {
                throw ("Error in Shader: " + attribute.getName());
            }
            this.gl.bindBuffer(attribute.getTarget(), attribute.getBuffer());
            this.gl.enableVertexAttribArray(location);
            this.gl.vertexAttribPointer(location, attribute.getSize(), this.gl.FLOAT, false, 0, 0);
        }
    },

    getUniformLocation: function (program, name) {
        return this.gl.getUniformLocation(program, name);
    },

    activateUniform: function (uniform) {
        switch (uniform.getKind()) {
            case UniformKind.COLOR:
                this.gl.uniform4f(uniform.getLocation(),
                    uniform.getValue()[0], uniform.getValue()[1],
                    uniform.getValue()[2], uniform.getValue()[3]);
                break;
            case UniformKind.OBJECTMATRIX:
            case UniformKind.FRUSTUMMATRIX:
                this.gl.uniformMatrix4fv(uniform.getLocation(), false, uniform.getValue());
                break;
            case UniformKind.DIRECTLIGHT:
            case UniformKind.POINTLIGHT:
                this.gl.uniform3f(uniform.getLocation(),
                    uniform.getValue()[0], uniform.getValue()[1],
                    uniform.getValue()[2]);
                break;
            case UniformKind.TEXTURE:
                this.gl.activeTexture(this.gl.TEXTURE0 + uniform.textureIndex);
                this.gl.uniform1i(uniform.getLocation(), uniform.textureIndex);
                asdf
                gl.bindTexture(gl.TEXTURE_2D, textures[0]); // 
                break;
        }
    },

    createTexture: function () {
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA
            , this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        return texture;
    },

    setTexture: function (newTexture, newImage) {
        var image = new Image();
        image.crossOrigin = "";
        image.src = newImage;
        image.tag = this.gl;

        image.addEventListener('load', function () {
            image.tag.bindTexture(image.tag.TEXTURE_2D, newTexture);
            image.tag.texImage2D(image.tag.TEXTURE_2D, 0, image.tag.RGBA,
                image.tag.RGBA, image.tag.UNSIGNED_BYTE, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                image.tag.generateMipmap(image.tag.TEXTURE_2D);
            }
            else {
                image.tag.texParameteri(image.tag.TEXTURE_2D, image.tag.TEXTURE_WRAP_S, image.tag.CLAMP_TO_EDGE);
                image.tag.texParameteri(image.tag.TEXTURE_2D, image.tag.TEXTURE_WRAP_T, image.tag.CLAMP_TO_EDGE);
                image.tag.texParameteri(image.tag.TEXTURE_2D, image.tag.TEXTURE_MIN_FILTER, image.tag.LINEAR);
            }
        });
    },

    setDrawModes: function () {
        //this.gl.enable(this.gl.CULL_FACE);     
        this.gl.enable(this.gl.DEPTH_TEST);
    },

    draw: function (countIndices) {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, countIndices);
    },

    drawElement: function (countElements) {
        this.gl.drawElements(this.gl.TRIANGLES, countElements, this.gl.UNSIGNED_SHORT, 0);
    }

}
