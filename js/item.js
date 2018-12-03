"use strict";
var Item = function(gl, object3D){
   
    var attributes = [];
        
    // constructor
    if(object3D.hasKind(AttributeKind.POSITION)){
        attributes.push(new Attribute(gl,
            "a_position",
            AttributeKind.POSITION,
            gl.ARRAY_BUFFER,
            object3D.getCoords()));
    }

    // getter, setter
    this.getAttributes = function(){
        return attributes;
    }
       
    // functions
    this.draw = function(){
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    } 
    
}