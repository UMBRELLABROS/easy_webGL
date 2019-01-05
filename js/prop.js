"use strict";
var Prop = function(){
    this.normals = null;
       
}

var PropService = function(newProp){

    var coords;
    var color = null;
    var colorArray = null;
    var surface = null;
    var position = null;
    var velocity = [];
    var rotation = [];

    // getter, setter
    this.getVelocity = function(){return velocity;}
    this.setVelocity = function(newVelocity){velocity = newVelocity;}

    this.getRotation = function(){return rotation;}
    this.setRotation = function(newRotation){rotation = newRotation;}
    
    this.setCoords = function(newCoords){coords = newCoords;}
    this.getCoords = function(){return coords;}

    this.setPosition = function(newPosition){position = newPosition;}    
    this.getPosition = function(){return position;}

    this.getColor = function(){return color;}
    this.setColor = function(newColor){color = newColor;}

    this.getColorArray = function(){return colorArray;}
    this.setColorArray = function(newColorArray){colorArray = newColorArray;}

    this.getNormals = function(){return this.normals;}
    this.setNormals = function(newNormals){this.normals = newNormals;}

    // constructor    
    if (newProp.hasOwnProperty("coords")) {
        this.setCoords(newProp.coords);                 
    }
    if (newProp.hasOwnProperty("normals")) {
        this.setNormals(newProp.normals);                 
    }
    if (newProp.hasOwnProperty("color")) {
        this.setColor(newProp.color);                 
    }
    if (newProp.hasOwnProperty("colorArray")) {
        this.setColorArray(newProp.colorArray);                 
    }
    if (newProp.hasOwnProperty("position")) {
        this.setPosition(newProp.position);                 
    }
    
}
PropService.prototype = new Prop;