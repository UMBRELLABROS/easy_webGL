"use strict";
var Attribute = function(){
        
    this.location;
    this.kind;
    this.name;        
    this.target;   
    this.buffer;
    // srcData
    var cnt;
    
    // getter, setter
    this.setTarget = function(newTarget){this.target = newTarget;}
    this.getTarget = function(){return this.target;}

    this.setLocation = function(newLocation){this.location = newLocation;}
    this.getLocation =function(){return this.location;}

    this.setName = function(newName){this.name = newName;}
    this.getName = function(){return this.name;}

    this.setKind = function(newKind){this.kind = newKind;}
    this.getKind = function(){return this.kind;}

    this.getBuffer = function(){return this.buffer;}
    this.setBuffer = function(newBuffer){this.buffer = newBuffer;}

    this.getCnt = function(){return cnt||0;}
    this.setCnt = function(newCnt){cnt = newCnt;}
}

var AttributeService = function(){

    var srcData = [];      
    this.setSrcData = function(newSrcData){
        switch(this.kind){
            case "index":
                srcData = new Int32Array(newSrcData); 
                this.setTarget(Gl.getTarget(TargetKind.ELEMENT_ARRAY_BUFFER));               
            break;
            default:
                srcData = new Float32Array(newSrcData); 
                this.setTarget(Gl.getTarget(TargetKind.ARRAY_BUFFER));               
        }                
    }       
    this.getSrcData = function(){return srcData;} 

    this.equals = function(newAttribute){
        if(newAttribute.getKind() != this.getKind()) return false;
        if(newAttribute.getName() != this.getName()) return false;        
        return true;
    }

    this.create = function(newKind, newName, newData){        
        this.setKind(newKind);
        this.setName(newName);
        this.setSrcData(newData);        
    }

    this.createBuffer = function(){                  
        this.setBuffer(Gl.createBuffer(this));
    }

    this.activate = function(){
        Gl.activateAttribute(this);
    }

}
AttributeService.prototype = new Attribute;

   