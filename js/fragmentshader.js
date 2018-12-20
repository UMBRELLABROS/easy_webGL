"use strict";
var FragmentShader = function(){
    
    this.attributeColorName;       
    this.code ;

    // getter, setter
    this.getCode = function(){return this.code;}
    this.setCode = function(newCode){this.code = newCode;}
    
    this.getAttributeColorName = function(){return this.attributeColorName;} 
    this.setAttributeColorName = function(newAttributeColorName){
        this.attributeColorName = newAttributeColorName;
    }
}

var FragmentShaderService = function(item){    

    var varyingNames = [];
    this.getVaryingNames = function(){return varyingNames;}
    this.setVaryingNames = function(newVaryingNames){
        varyingNames = newVaryingNames;
    }

    // functions
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
        if( this.getVaryingNames.length == 0){
            text += "gl_FragColor = vec4(1,0,0,1);\n"
        }
        return text;
    }

    // constructor  
    var shaderCode =  "precision mediump float;\n"   
    shaderCode += this.buildVarying();
    shaderCode += this.buildMain();
    this.setCode(shaderCode);
}
FragmentShaderService.prototype = new FragmentShader;