"use strict";
var VertexShader = function(){
    
    this.attributeCoordsName;    
    this.attributeColorName = null;
    this.code = "";

    // getter, setter
    this.getCode = function(){
        return this.code;
    }
    this.setCode = function(newCode){this.code= newCode;}

    this.getAttributeCoordName = function(){return this.attributeCoordsName;}
    this.setAttributeCoordName = function(newAttributeCoordName){ 
        this.attributeCoordsName = newAttributeCoordName;
    }

    this.getAttributeColorName = function(){return this.attributeColorName;}
    this.setAttributeColorName = function(newAttributeColorName){ 
        this.attributeColorName = newAttributeColorName;
    }

}

var VertexShaderService = function(item){

    this.buildAttributes = function (){
        var text = "";    
        // required    
        text += "attribute vec3 " + this.getAttributeCoordName() + ";\n";  
        if(this.getAttributeColorName() != null){
            text += "attribute vec4 " + this.getAttributeColorName() + ";\n";                     
        }
        return text;       
    }

    this.buildUniforms = function() {return "";}

    this.buildVarying = function () {
        var text = "";   
        if(this.getAttributeColorName() != null){            
            text += "varying vec4 " + this.getAttributeColorName().replace("a_", "v_") + ";\n";           
        }        
        return text;
    }

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
        if(this.getAttributeColorName() != null){
            text += this.getAttributeColorName().replace("a_", "v_") + 
                  "=" + this.getAttributeColorName() + ";\n";
        }       
        return text;
    }

    // constructor        
    var attributes = item.getAttributes();
    attributes.forEach(attribute =>{
        if(attribute.getKind() == AttributeKind.COORDS){
            this.setAttributeCoordName(attribute.getName());
        }
        if(attribute.getKind() == AttributeKind.COLOR){
            this.setAttributeColorName(attribute.getName());
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