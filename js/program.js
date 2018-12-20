"use strict";
var Program = function(){
        
    var indexCnt;
    this.index;

    // getter, setter    
    this.setIndex = function(newIndex){this.index = newIndex;}
    this.getIndex = function(){return this.index;}

    this.getIndexCnt = function(){return indexCnt||0;}
    this.setIndexCnt = function(newIndexCnt){indexCnt = newIndexCnt;}
}
   
var ProgramService = function(){

    this.create = function(vertexShaderCode, fragmentShaderCode){
        var vertexShader = Gl.createShader(ShaderKind.VERTEX, vertexShaderCode);
        var fragementShader = Gl.createShader(ShaderKind.FRAGMENT, fragmentShaderCode);
        var program = Gl.createProgram(vertexShader, fragementShader);       
        return program;
    }    

}
ProgramService.prototype = new Program;