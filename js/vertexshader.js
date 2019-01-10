"use strict";
var VertexShader = function(){
    
    this.attributeCoordsName;    
    this.attributeNormalsName = null;
    this.attributeColorName = null;
    this.attributeUVCoordsName = null;
    this.uniformMatrixName = null;
    this.uniformTextureName = null;
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

    this.getAttributeNormalsName = function(){return this.attributeNormalsName;}
    this.setAttributeNormalsName = function(newAttributeNormalsName){ 
        this.attributeNormalsName = newAttributeNormalsName;
    }

    this.getAttributeColorName = function(){return this.attributeColorName;}
    this.setAttributeColorName = function(newAttributeColorName){ 
        this.attributeColorName = newAttributeColorName;
    }

    this.getUniformMatrixName = function(){return this.uniformMatrixName;}
    this.setUniformMatrixName = function(newUniformMatrixName){ 
        this.uniformMatrixName = newUniformMatrixName;
    }

}

var VertexShaderService = function(item){

    this.buildAttributes = function (){
        var text = "";    
        // required   
        if(this.getUniformMatrixName()!= null){
            text += "attribute vec4 " + this.getAttributeCoordName() + ";\n";  
        } 
        else{
            text += "attribute vec3 " + this.getAttributeCoordName() + ";\n";  
        } 
        if(this.getAttributeNormalsName() != null){
            text += "attribute vec3 " + this.getAttributeNormalsName() + ";\n";                     
        }       
        if(this.getAttributeColorName() != null){
            text += "attribute vec4 " + this.getAttributeColorName() + ";\n";                     
        }
        if(this.attributeUVCoordsName != null){
            text += "attribute vec2 " +this.attributeUVCoordsName + ";\n"; 
        }
        return text;       
    }

    this.buildUniforms = function() {
        var text = ""; 
        if(this.getUniformMatrixName()!= null){
            text += "uniform mat4 " + this.getUniformMatrixName() + ";\n";
        }
        return text;
    }

    this.buildVarying = function () {
        var text = "";   
        if(this.getAttributeColorName() != null){            
            text += "varying vec4 " + this.getAttributeColorName().replace("a_", "v_") + ";\n";           
        }      
        if(this.getAttributeNormalsName() != null){
            text += "varying vec3 " + this.getAttributeNormalsName().replace("a_", "v_") + ";\n";                     
        }   
        if(this.attributeUVCoordsName != null){
            text += "varying vec2 " +this.attributeUVCoordsName.replace("a_", "v_")  + ";\n"; 
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
        if(this.getUniformMatrixName()!= null ){ 
            text += "gl_Position = " 
            + this.getUniformMatrixName() + "*"
            + this.getAttributeCoordName() + ";\n";
        }        
        else{    
            text += "gl_Position = vec4(" + this.getAttributeCoordName() + ",1);\n";             
        }   
        if(this.getAttributeColorName() != null){
            text += this.getAttributeColorName().replace("a_", "v_") 
                + "=" + this.getAttributeColorName() + ";\n";
        }    
        if(this.getAttributeNormalsName() != null && 
            this.getUniformMatrixName()!= null){
            text += this.getAttributeNormalsName().replace("a_", "v_")  
                +"=mat3("+ this.getUniformMatrixName() +")*" 
                + this.getAttributeNormalsName() + ";\n";
        }  
        if(this.attributeUVCoordsName != null){
            text += this.attributeUVCoordsName.replace("a_", "v_") 
                + "=" + this.attributeUVCoordsName + ";\n";
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
        if(attribute.getKind() == AttributeKind.NORMALS){
            this.setAttributeNormalsName(attribute.getName());
        }     
        if(attribute.getKind() == AttributeKind.UVCOORDS){
            this.attributeUVCoordsName = attribute.getName();
        }  
    })        
    var uniforms = item.getUniforms();
    uniforms.forEach(uniform =>{
        if(uniform.getKind() == UniformKind.MATRIX){
            this.setUniformMatrixName(uniform.getName());
        }
        if(uniform.getKind() == UniformKind.TEXTURE){
            this.uniformTextureName = uniform.getName();
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