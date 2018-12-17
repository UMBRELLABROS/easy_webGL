"use strict";
var Attribute = function(){
    
    var location = 0;
    var kind;
    var name;    
    var srcData;      
    var target = TargetKind.ARRAY_BUFFER;   
    
    // getter, setter
    this.setTarget = function(newTarget){target= newTarget;}
    this.getTarget = function(){return target;}

    this.setSrcData = function(newSrcData){
        switch(kind){
            case "index":
                srcData = new Int32Array(newSrcData); 
                this.setTarget = TargetKind.ELEMENT_ARRAY_BUFFER;               
            break;
            default:
                srcData = new Float32Array(newSrcData);                
        }                
    }       
    this.getSrcData = function(){return srcData;} 

    this.setLocation = function(newLocation){location = newLocation;}
    this.getLocation =function(){return location;}

    this.setName = function(newName){name = newName;}
    this.getName = function(){return name;}

    this.setKind = function(newKind){kind = newKind;}
    this.getKind = function(){return kind;}
}

var AttributeService = function(){

    this.equals = function(newAttribute){
        if(newAttribute.kind != kind) return false;
        if(newAttribute.name != name) return false;
        return true;
    }

    this.create = function(newKind, newName, newData){
        this.setKind(newKind);
        this.setName(newName);
        this.setSrcData(newData);
        Gl.createBuffer(this);
    }

    this.activate = function(){
        Gl.activateAttribute(this);
    }

}
AttributeService.prototype = new Attribute;

   