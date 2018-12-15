"use strict";
var Scene = function(newProps, newLights, newCameras){

    var props = [];
    var lights = [];
    var cameras = [];
    
    // getter, setter
    this.setProps = function(newProps){props = newProps;}
    
    this.getProps = function(){return props;}

    this.setLights = function(newLights){lights = newLights;}

    this.getLights = function(){return lights;}

    this.setCameras = function(newCameras){cameras = newCameras;}

    this.getCameras = function(){return cameras;}

    // constructor
    this.setProps(newProps); 
    this.setLights(newLights); 
    this.setCameras(newCameras); 

}

var SceneService = function(){

}
SceneService.prototype = new Scene();

    