"use strict";
var Gl = {
    gl : null,
    program : null,
    attributes: [],    

    // getter, setter
    setGl : function(newGl){this.gl = newGl;},

    // functions
    createShader : function(shaderType, shaderCode){
        var shader = this.gl.createShader(
            shaderType==ShaderKind.VERTEX?this.gl.VERTEX_SHADER:this.gl.FRAGMENT_SHADER
            );
        this.gl.shaderSource(shader,shaderCode);
    	this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {            
            throw "Error in shader:" + shaderType + this.gl.getShaderInfoLog(shader);
        }

        var source = this.gl.getShaderSource(shader);
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

    getTarget : function(newTarget){
        var target = this.gl.ARRAY_BUFFER; 
        if( newTarget == TargetKind.ELEMENT_ARRAY_BUFFER){
            target = this.gl.ELEMENT_ARRAY_BUFFER;
        }
        return target;
    },

    createBuffer : function(attribute){
        var foundAttribute = null;
        this.getAttributes().forEach(localAttribute => {
            if(attribute.equals(localAttribute) && 
            attribute.getSrcData().equals(localAttribute.getSrcData())){                
                foundAttribute = localAttribute;   
                return;                        
            }    
        });      
        if (foundAttribute != null) 
            return foundAttribute.getBuffer();

        var	buffer = this.gl.createBuffer();
        var target = this.gl.ARRAY_BUFFER; 
        if( attribute.getTarget()==TargetKind.ELEMENT_ARRAY_BUFFER){
            target = this.gl.ELEMENT_ARRAY_BUFFER;
        }
	    this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, attribute.getSrcData(), this.gl.STATIC_DRAW);     
        
        this.getAttributes().push(attribute);   

        return buffer;
    },

    getAttributes : function(){
        return this.attributes;
    },

    getAttributeLocation : function(program, name){
        return this.gl.getAttribLocation(program, name);
    },

    useProgram : function(newProgram){        
        if(newProgram != this.program){
            this.program = newProgram;
            this.gl.useProgram(this.program);
        }
    },

    activateAttribute : function(attribute){
        var location = attribute.getLocation();
        this.gl.bindBuffer(attribute.getTarget(), attribute.getBuffer());
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, attribute.getSize(), this.gl.FLOAT, false, 0, 0);
    },

    getUniformLocation : function(program, name){
        return this.gl.getUniformLocation(program, name);
    },

    activateUniform : function(uniform){
        switch(uniform.getKind()){
            case UniformKind.COLOR:
                this.gl.uniform4f(uniform.getLocation(),
                uniform.getValue()[0],uniform.getValue()[1],
                uniform.getValue()[2],uniform.getValue()[3]);
            break;
            case UniformKind.MATRIX:
                this.gl.uniformMatrix4fv(uniform.getLocation(), false, uniform.getValue());
            break;
        }
    },

    draw :  function(){
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

}
