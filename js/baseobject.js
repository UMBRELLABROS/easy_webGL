"use strict";
var BaseObject = function(){

    this.position = [0,0,0];        
    this.dimension = [0,0,0];
    this.kinds = [AttributeKind.POSITION];
    
    // geter, setter
    this.setPosition = function (newPosition){
        this.position[0] = newPosition[0];
        this.position[1] = newPosition[1];
        this.position[2] = newPosition[2];
    }
    this.getPosition = function(){return this.position;}

    this.setDimension = function(newDimension){
        this.dimension[0] = newDimension[0];
        this.dimension[1] = newDimension[1];
        this.dimension[2] = newDimension[2];        
    }

    this.getDimension = function() {return this.dimension};

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

    this.hasKind = function(kind){
        return kinds.indexOf(kind)==-1?false:true;
    }
    
}