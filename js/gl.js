"use strict";
var Gl = {
    gl : null,
    program : null,

    // getter, setter
    setGl : function(newGl){this.gl = newGl;},

    // functions
    setFloatAttribute : function(newData){
        var buffer = this.gl.createBuffer(); 
        var array = new Float32Array(newData);
        this.gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);        
    },

    createShader : function(shaderType, shaderCode){
        var shader = this.gl.createShader(
            shaderType==ShaderKind.VERTEX?this.gl.VERTEX_SHADER:this.gl.FRAGMENT_SHADER
            );
        this.gl.shaderSource(shader,shaderCode);
    	this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {            
            throw "Error in shader:" + shaderType + this.gl.getShaderInfoLog(shader);
        }
        return shader;
    },

    createProgram : function(vertexShader, fragmentShader){
        var program = this.gl.createProgram();        
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);            
        this.gl.linkProgram(program);     

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {            
            throw ("Error in program:" + this.gl.getProgramInfoLog (program));
        }       
        return program;
    },

    createBuffer : function(attribute){
        var	buffer = this.gl.createBuffer();
        var target = this.gl.ARRAY_BUFFER; 
        if( attribute.getTarget()==TargetKind.ELEMENT_ARRAY_BUFFER){
            target = this.gl.ELEMENT_ARRAY_BUFFER;
        }
	    this.gl.bindBuffer(target, buffer);
	    this.gl.bufferData(target, attribute.getSrcData(), this.gl.STATIC_DRAW);
    },

    useProgram : function(newProgram){
        if(newProgram != this.program){
            this.program = newProgram;
            this.gl.useProgram(this.program);
        }
    },

    activateAttribute : function(attribute){
        var location = attribute.getLocation();
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
    },

    draw :  function(){
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

}
