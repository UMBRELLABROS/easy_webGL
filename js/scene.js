"use strict";
var Scene = function(gl, newItems){

    var program;
    var items = [];
    var vertexShaderCode;
    var fragmentShaderCode;

    // constructor
    items = newItems;
    program = new Program(gl);        
    init();

    // getter, setter
    this.getItems = function(){
        return items;
    }

    // functions
    function init (){
        var vertexShader = new VertexShader(newItems)
        vertexShaderCode = vertexShader.getShaderCode();
        var fragmentShader = new FragmentShader(newItems);
        fragmentShaderCode = fragmentShader.getShaderCode();        
        program.setShader(vertexShaderCode, gl.VERTEX_SHADER);
        program.setShader(fragmentShaderCode, gl.FRAGMENT_SHADER);
        program.link();
    }

    this.use = function(){
        program.use();
    }

    this.getAttributeLocation = function(name){       
        return program.getAttributeLocation(name);
    }

}