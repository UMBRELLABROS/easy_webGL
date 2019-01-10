"use strict;"
var Texture = function(){
    this.image;   
    this.texture;

}

var TextureService = function(){

    this.preLoad = function(){
        this.texture = Gl.createTexture();
    }

    this.load = function(newImage){
        Gl.setTexture(this.texture, newImage);
    }

}
TextureService.prototype = new Texture;