"use strict";
var Attribute = function(gl, newName,  newKind, newTarget, newData){
    
    var attribute;
    var kind;
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

    this.setKind = function(newKind){kind = newKind;}

    this.getKind = function(){return kind;}

    // functions 
    this.enable = function(){
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    }

    // constructor
    attribute = gl.createBuffer();
    this.setName(newName);
    this.setKind(newKind);
    this.setTarget(newTarget);
    this.setScrData(newData);

}