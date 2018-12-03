"use strict";
var FragmentShader = function(items){
    
    var varyingNames = [];    
    var shaderCode = "precision mediump float;\n";

    // constructor      
    buildVarying();
    buildMain();

    // getter, setter
    this.getShaderCode = function(){
        return shaderCode;
    }

    // functions
    function buildVarying() {}

    function buildMain(){
        shaderCode += "void main(){\n";
        shaderCode += buildInnerMain();
        shaderCode += "}\n"
    }

    function buildInnerMain(){
        var text = "";
        if(varyingNames.length == 0){
            text += "gl_FragColor = vec4(1,0,0,1);\n"
        }
        return text;
    }

}