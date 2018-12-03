"use strict";
var VertexShader = function(items){
    
    var attributePositionNames = [];
    var uniformNames = [];
    var shaderCode = "";

    // constructor
    items.forEach(item => {
        var attributes = item.getAttributes();
        attributes.forEach(attribute =>{
            if(attribute.getKind() == AttributeKind.POSITION){
                if(attributePositionNames.indexOf(attribute.getName()) < 0){
                    attributePositionNames.push(attribute.getName());
                } 
            }
        })        
    });
    buildAttributes();
    buildUniforms();
    buildVarying();
    buildMain();

    // getter, setter
    this.getShaderCode = function(){
        return shaderCode;
    }

    // functions
    function buildAttributes(){
        attributePositionNames.forEach(attributeName => {
            shaderCode += "attribute vec3 " + attributeName + ";\n"; 
        })       
    }
    function buildUniforms() {}
    function buildVarying() {}

    function buildMain(){
        shaderCode += "void main(){\n";
        shaderCode += buildInnerMain();
        shaderCode += "}\n";
    }

    function buildInnerMain(){
        var text = "";
        if(attributePositionNames.length == 1 && uniformNames.length == 0){
            text += "gl_Position = vec4(" + attributePositionNames[0] + ",1);\n";
        }
        return text;
    }

}