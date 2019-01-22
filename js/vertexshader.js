"use strict";
var VertexShader = function () {

    this.attributeCoordsName;
    this.attributeNormalsName = null;
    this.attributeColorName = null;
    this.attributeUVCoordsName = null;
    this.uniformObjectMatrixName = null;
    this.uniformFrustumMatrixName = null;
    this.uniformTextureName = null;
    this.uniformLightPosition = null;
    this.code = "";

    // getter, setter
    this.getCode = function () {
        return this.code;
    }
    this.setCode = function (newCode) { this.code = newCode; }

    this.getAttributeNormalsName = function () { return this.attributeNormalsName; }
    this.setAttributeNormalsName = function (newAttributeNormalsName) {
        this.attributeNormalsName = newAttributeNormalsName;
    }

    this.getAttributeColorName = function () { return this.attributeColorName; }
    this.setAttributeColorName = function (newAttributeColorName) {
        this.attributeColorName = newAttributeColorName;
    }


}

var VertexShaderService = function (item) {

    this.buildAttributes = function () {
        var text = "";
        // required   
        if (this.uniformObjectMatrixName != null) {
            text += "attribute vec4 " + this.attributeCoordName + ";\n";
        }
        else {
            text += "attribute vec3 " + this.attributeCoordName + ";\n";
        }
        if (this.getAttributeNormalsName() != null) {
            text += "attribute vec3 " + this.getAttributeNormalsName() + ";\n";
        }
        if (this.getAttributeColorName() != null) {
            text += "attribute vec4 " + this.getAttributeColorName() + ";\n";
        }
        if (this.attributeUVCoordsName != null) {
            text += "attribute vec2 " + this.attributeUVCoordsName + ";\n";
        }
        return text;
    }

    this.buildUniforms = function () {
        var text = "";
        if (this.uniformObjectMatrixName != null) {
            text += "uniform mat4 " + this.uniformObjectMatrixName + ";\n";
        }
        if (this.uniformFrustumMatrixName != null) {
            text += "uniform mat4 " + this.uniformFrustumMatrixName + ";\n";
        }
        if (this.uniformLightPosition != null) {
            text += "uniform vec3 " + this.uniformLightPosition + ";\n";
        }
        return text;
    }

    this.buildVarying = function () {
        var text = "";
        if (this.getAttributeColorName() != null) {
            text += "varying vec4 " + this.getAttributeColorName().replace("a_", "v_") + ";\n";
        }
        if (this.getAttributeNormalsName() != null) {
            text += "varying vec3 " + this.getAttributeNormalsName().replace("a_", "v_") + ";\n";
        }
        if (this.attributeUVCoordsName != null) {
            text += "varying vec2 " + this.attributeUVCoordsName.replace("a_", "v_") + ";\n";
        }
        if (this.uniformLightPosition != null) {
            text += "varying vec3 v_surfaceToLight;\n";
        }
        return text;
    }

    this.buildMain = function () {
        var text = "";
        text += "void main(){\n";
        text += this.buildInnerMain();
        text += "}\n";
        return text;
    }

    this.buildInnerMain = function () {
        var text = "";
        if (this.uniformObjectMatrixName != null &&
            this.uniformFrustumMatrixName == null) {
            text += "gl_Position = "
                + this.uniformObjectMatrixName + "*"
                + this.attributeCoordName + ";\n";
        }
        else if (this.uniformObjectMatrixName != null &&
            this.uniformFrustumMatrixName != null) {
            text += "gl_Position = "
                + this.uniformFrustumMatrixName + "*"
                + this.uniformObjectMatrixName + "*"
                + this.attributeCoordName + ";\n";
        }
        else {
            text += "gl_Position = vec4(" + this.attributeCoordName + ",1);\n";
        }
        if (this.getAttributeColorName() != null) {
            text += this.getAttributeColorName().replace("a_", "v_")
                + "=" + this.getAttributeColorName() + ";\n";
        }
        if (this.getAttributeNormalsName() != null &&
            this.uniformObjectMatrixName != null) {
            text += this.getAttributeNormalsName().replace("a_", "v_")
                + "=mat3(" + this.uniformObjectMatrixName + ")*"
                + this.getAttributeNormalsName() + ";\n";
        }
        if (this.attributeUVCoordsName != null) {
            text += this.attributeUVCoordsName.replace("a_", "v_")
                + "=" + this.attributeUVCoordsName + ";\n";
        }
        if (this.uniformLightPosition != null) {
            text += "vec3 surfacePosition = (" + this.uniformObjectMatrixName + " * " + this.attributeCoordName + ").xyz;\n";
            text += "v_surfaceToLight = " + this.uniformLightPosition + " - surfacePosition;\n";
        }
        return text;
    }

    // constructor        
    var attributes = item.getAttributes();
    attributes.forEach(attribute => {
        if (attribute.getKind() == AttributeKind.COORDS) {
            this.attributeCoordName = attribute.getName();
        }
        if (attribute.getKind() == AttributeKind.COLOR) {
            this.setAttributeColorName(attribute.getName());
        }
        if (attribute.getKind() == AttributeKind.NORMALS) {
            this.setAttributeNormalsName(attribute.getName());
        }
        if (attribute.getKind() == AttributeKind.UVCOORDS) {
            this.attributeUVCoordsName = attribute.getName();
        }
    })
    var uniforms = item.getUniforms();
    uniforms.forEach(uniform => {
        if (uniform.getKind() == UniformKind.OBJECTMATRIX) {
            this.uniformObjectMatrixName = uniform.getName();
        }
        if (uniform.getKind() == UniformKind.FRUSTUMMATRIX) {
            this.uniformFrustumMatrixName = uniform.getName();
        }
        if (uniform.getKind() == UniformKind.TEXTURE) {
            this.uniformTextureName = uniform.getName();
        }
        if (uniform.getKind() == UniformKind.POINTLIGHT) {
            this.uniformLightPosition = uniform.getName();
        }
    });

    var shaderCode = "";
    shaderCode += this.buildAttributes();
    shaderCode += this.buildUniforms();
    shaderCode += this.buildVarying();
    shaderCode += this.buildMain();
    this.setCode(shaderCode);

}
VertexShaderService.prototype = new VertexShader;