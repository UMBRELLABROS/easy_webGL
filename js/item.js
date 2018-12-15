"use strict";
var Item = function(){
   
    var attributes = [];
    var uniforms = [];
    var program;

    // getter, setter
    this.setProgram = function(newProgram){program = newProgram;} 
    this.getProgram = function(){return program;}

    this.setAttributes = function(newAttributes){attributes = newAttributes;} 
    this.getAttributes = function(){return attributes;} 


}
var ItemService = function(prop,lights,camera){

    this.create = function(prop,lights,camera){
        var attributes = [];
        var coords = prop.getCoords();
        var position = prop.getPosition()||[0,0,0];

        var coordsAttribute = new Attribute();
        coordsAttribute.create("coords","a_coords",coords);
        attributes.push(coordsAttribute);
    }

}   
ItemService.prototype = new Item();

            


   
    
