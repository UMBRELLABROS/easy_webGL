"use strict";
var VertexShader = function(){
    
    var attributeCoordsName;
    var uniformNames = [];
    var code = "";

    // getter, setter
    this.getCode = function(){
        return code;
    }
    this.setCode = function(newCode){code= newCode;}

    this.getAttributeCoordName = function(){return attributeCoordsName;}
    this.setAttributeCoordName = function(newAttributeCoordName){ 
        attributeCoordsName = newAttributeCoordName;
    }

}

var VertexShaderService = function(item){

    this.buildAttributes = function (){
        var text = "";    
        // required    
        text += "attribute vec3 " + this.getAttributeCoordName() + ";\n";  
        return text;       
    }
    this.buildUniforms = function() {return "";}
    this.buildVarying = function () {return "";}

    this.buildMain = function (){
        var text=""; 
        text += "void main(){\n";
        text += this.buildInnerMain();
        text += "}\n";
        return text;
    }

    this.buildInnerMain = function(){
        var text = "";
        
        text += "gl_Position = vec4(" + this.getAttributeCoordName() + ",1);\n";
        
        return text;
    }

    // constructor        
    var attributes = item.getAttributes();
    attributes.forEach(attribute =>{
        if(attribute.getKind() == AttributeKind.COORDS){
            this.setAttributeCoordName(attribute.getName());
        }
    })        
    var shaderCode = "";
    shaderCode += this.buildAttributes();
    shaderCode += this.buildUniforms();
    shaderCode += this.buildVarying();
    shaderCode += this.buildMain();
    this.setCode(shaderCode);

}
VertexShaderService.prototype = new VertexShader;