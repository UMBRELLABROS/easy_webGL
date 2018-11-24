"use strict";
var Attribute = function(gl){
    
    var attribute;
    var name;
    var target = gl.ARRAY_BUFFER;
    var srcData;
    var usage = gl.STATIC_DRAW; 
    var index;   
    var type = gl.FLOAT;
    var size = 3;
    var normalized = false;
    var stride = 0;
    var offset = 0;

    // constructor
    attribute = gl.createBuffer();

    // getter, setter
    this.setTarget = function(newTarget){
        target= newTarget;
        gl.bindBuffer(target,attribute);
    }

    this.setScrData = function(newSrcData){
        switch(target){
            case gl.ELEMENT_ARRAY_BUFFER:
                srcData = new Int32Array(newSrcData);
            break;
            default:
                srcData = new Float32Array(newSrcData);                
        }        
        gl.bufferData(target, srcData, usage);
    }    

    this.setIndex = function(newIndex){
        index = newIndex;
    }

    this.setName = function(newName){name = newName;}

    this.getName = function(){return name;}

    // functions 
    this.enable = function(){
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    }


}