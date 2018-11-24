"use strict";
var Program = function(gl){
    
    var program;
    var index;
   
    // constructor
    program = gl.createProgram();

    // getter, setter    
    this.setIndex = function(newIndex){index = newIndex;}

    this.getIndex = function(){return index;}

    // functions 
    this.setShader = function(newSource, newType){
        var shader = gl.createShader(newType);
        gl.shaderSource(shader, newSource);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
    }

    this.getAttributeLocation = function(name){
        return gl.getAttribLocation(program, name);
    }

    this.use = function(){gl.useProgram(program);}

    this.link = function(){gl.linkProgram(program);}

}