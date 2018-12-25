"use strict";
var Prop = function(){
    
       
}

var PropService = function(newProp){

    var coords;
    var color = null;
    var surface = null;
    var position = null;

    // getter, setter
    this.setCoords = function(newCoords){coords = newCoords;}
    this.getCoords = function(){return coords;}

    this.setPosition = function(newPosition){position = newPosition;}    
    this.getPosition = function(){return position;}

    this.getColor = function(){return color;}
    this.setColor = function(newColor){color = newColor;}


    // constructor    
    if (newProp.hasOwnProperty("coords")) {
        this.setCoords(newProp.coords);                 
    }
    if (newProp.hasOwnProperty("color")) {
        this.setColor(newProp.color);                 
    }
    
}
PropService.prototype = new Prop;