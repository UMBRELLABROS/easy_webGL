"use strict";
var Prop = function(newProp){
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
    for (var key in newProp) {
        if (newProp.hasOwnProperty(key)) {
            switch(key){
                case "coords":
                    this.setForm(newProp.coords);
                    break;
            }
            
        }
    }    

}

var PropService = function(){

}
PropService.prototype = new Prop();