"use strict";
var Prop = function(){
    
       
}

var PropService = function(newProp){

    var coords;
    var color;
    var surface;
    var position;

    // getter, setter
    this.setCoords = function(newCoords){coords = newCoords;}
    this.getCoords = function(){return coords;}

    this.setPosition = function(newPosition){position = newPosition;}    
    this.getPosition = function(){return position;}


    // constructor    
    if (newProp.hasOwnProperty("coords")) {
        this.setCoords(newProp.coords);                 
    }
    
}
PropService.prototype = new Prop;