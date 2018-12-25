"use strict";
var FragmentShader = function(){
    
    this.uniformColorName = null;
    this.attributeColorName;       
    this.code ;

    // getter, setter
    this.getCode = function(){return this.code;}
    this.setCode = function(newCode){this.code = newCode;}
    
    this.getAttributeColorName = function(){return this.attributeColorName;} 
    this.setAttributeColorName = function(newAttributeColorName){
        this.attributeColorName = newAttributeColorName;
    }

    this.getUniformColorName = function(){return this.uniformColorName;} 
    this.setUniformColorName = function(newUniformColorName){
        this.uniformColorName = newUniformColorName;
    }
}

var FragmentShaderService = function(item){    

    var varyings = [];
    var uniforms = [];

    this.getVaryings = function(){return varyings;}
    this.setVaryings = function(newVaryings){
        varyings = newVaryings;
    }

    this.getUniforms = function(){return uniforms;}
    this.setUniforms = function(newUniforms){
        uniforms = newUniforms;
    }

    // functions

    this.buildUniforms = function() {
        var text = "";
        if(this.getUniformColorName()!=null){            
            text += "uniform vec4 " + this.getUniformColorName() + ";\n";
        }
        return text;
    }

    this.buildVarying = function() {
        return "";
    }

    this.buildMain = function(){
        var text = "";
        text += "void main(){\n";
        text += this.buildInnerMain();
        text += "}\n";
        return text;
    }

    this.buildInnerMain = function(){
        var text = "";
        if( this.getVaryings().length == 0 &&
            this.getUniforms().length == 0){
            text += "gl_FragColor = vec4(1,0,0,1);\n"
        }
        if( this.getVaryings().length == 0 &&
            this.getUniforms().length > 0){
                this.getUniforms().forEach(uniform => {
                    if(uniform.getKind() == UniformKind.COLOR){
                        text += "gl_FragColor = " + uniform.getName() + ";\n";        
                    }                    
                });
            
        }
        return text;
    }

    // constructor  
    this.setUniforms(item.getUniforms());
    this.getUniforms().forEach(uniform =>{
        if(uniform.getKind() == UniformKind.COLOR){
            this.setUniformColorName(uniform.getName());
        }
    })  

    var shaderCode =  "precision mediump float;\n"   
    shaderCode += this.buildUniforms();
    shaderCode += this.buildVarying();
    shaderCode += this.buildMain();
    this.setCode(shaderCode);
}
FragmentShaderService.prototype = new FragmentShader;