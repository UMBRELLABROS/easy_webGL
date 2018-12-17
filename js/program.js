"use strict";
var Program = function(){
        
    var index;

    // getter, setter    
    this.setIndex = function(newIndex){index = newIndex;}

    this.getIndex = function(){return index;}
}
   
var ProgramService = function(){

    this.create = function(vertexShaderCode, fragmentShaderCode){
        var vertexShader = Gl.createShader(ShaderKind.VERTEX, vertexShaderCode);
        var fragementShader = Gl.createShader(ShaderKind.FRAGMENT, fragmentShaderCode);
        var program = Gl.createProgram(vertexShader, fragementShader);
        return program;
    }    
        
   
}