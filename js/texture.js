"use strict;"
var Texture = function(){
    this.image;
    this.location;

    this.setLocation = function(newLocation){this.location = newLocation;}
    this.getLocation = function(){return this.location;}
}

var TextureService = function(){

    this.preLoad = function(){

    }

    this.load = function(){
        
    }

}
TextureService.prototype = new Texture;