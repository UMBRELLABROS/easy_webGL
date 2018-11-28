"use strict";
var BaseObject = function(){

    var position = [];        
    var dimension = [];
    
    // geter, setter
    this.setPosition = function (newPosition){
        position[0] = newPosition[0];
        position[1] = newPosition[1];
        position[2] = newPosition[2];
    }
    this.getPosition = function(){return position;}

    this.setDimension = function(newDimension){
        dimension[0] = newDimension[0];
        dimension[1] = newDimension[1];
        dimension[2] = newDimension[2];        
    }

    this.getDimension = function() {return dimension};

    // functions
    this.parseParams = function(params) {
        if(typeof params == "object"){
            if(params.dimension != null && Array.isArray(params.dimension)){
                this.setDimension(params.dimension);
            }                
            if(params.position != null && Array.isArray(params.position)){
                this.setPosition(params.position);
            }                
        }
    }     
}