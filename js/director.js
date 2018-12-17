"use strict";
var Director = function(){
    
    var worlds = [];

    // getter, setter
    this.setGl = function(newGl){Gl.setGl(newGl);}

    this.setWorlds = function(newWorlds) {worlds = newWorlds;}

    this.getWorlds = function(){return worlds;} 
    
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
        this.getWorlds().forEach(world => {
            world.draw();
        });

    } 

    // constructor
    this.setGl(gl);

}
DirectorController.prototype = new Director;