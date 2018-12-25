"use strict";
var Uniform = function(){
        
    this.location;
    this.kind;
    this.name;      
         
    this.setLocation = function(newLocation){this.location = newLocation;}
    this.getLocation = function(){return this.location;}

    this.setName = function(newName){this.name = newName;}
    this.getName = function(){return this.name;}

    this.setKind = function(newKind){this.kind = newKind;}
    this.getKind = function(){return this.kind;}

}

var UniformService = function(){
    this.value; 

    this.setValue = function(newValue){this.value = newValue;}
    this.getValue = function(){return this.value;}

    this.create = function(newKind, newName, newValue){        
        this.setKind(newKind);
        this.setName(newName);
        this.setValue(newValue);
    }

    this.activate = function(){
        Gl.activateUniform(this);
    }
}
UniformService.prototype = new Uniform;