"use strict";
var Director = function(){
    var gl;
    var worlds = [];

    // getter, setter
    this.setGl = function(newGl){gl = newGl;}

    this.setWorlds = function(newWorlds) {worlds = newWorlds;}

    this.getWorlds = function(){return worlds;} 

    // constructor
    this.setGl(gl);
} 

var DirectorController = function(gl){
    
    // functions
    this.addScene = function(newScenes){
        var worlds = [];
        newScenes.forEach(scene => {
            var world = new WorldService();
            world.createItems(scene)
            worlds.push(world);
        });
        this.setWorlds(worlds);
    } 

    this.action = function(){

    } 

}
DirectorController.prototype = new Director;