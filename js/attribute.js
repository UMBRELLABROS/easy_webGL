"use strict";
var Attribute = function(){
    
    var attribute;
    var kind;
    var name;
    var target  //gl.ARRAY_BUFFER;
    var srcData;
    var usage // gl.STATIC_DRAW; 
    var index;   
    var type // gl.FLOAT;
    var size = 3;
    var normalized = false;
    var stride = 0;
    var offset = 0;
    
    // getter, setter
    this.setTarget = function(newTarget){target= newTarget;}

    this.setScrData = function(newSrcData){
        switch(kind){
            case "index":
                srcData = new Int32Array(newSrcData);
            break;
            default:
                srcData = new Float32Array(newSrcData);                
        }                
    }   
    
    this.getSourceData = function(){return srcData;} 

    this.setIndex = function(newIndex){index = newIndex;}
    this.getIndex =function(){return index;}

    this.setName = function(newName){name = newName;}
    this.getName = function(){return name;}

    this.setKind = function(newKind){kind = newKind;}
    this.getKind = function(){return kind;}
}

var AttributeService = function(){
    this.create = function(newKind, newName, newData){
        this.setKind(newKind);
        this.setName(newName);
        this.setScrData(newData);
    }

}
AttributeService.prototype = new Attribute();

   