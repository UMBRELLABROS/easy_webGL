"use strict";
var Director = function(){
    
    // worlds
    
    // getter, setter
    this.setGl = function(newGl){Gl.setGl(newGl);}

} 

var DirectorController = function(canvas){

    var worlds = [];
    this.setWorlds = function(newWorlds) {worlds = newWorlds;}
    this.getWorlds = function(){return worlds;} 
    
    // functions
    this.addScene = function(newScenes){
        
        newScenes.forEach(scene => {
            var world = new WorldService();
            world.createItems(scene)
            this.getWorlds().push(world);            
        });        
    } 

    this.action = function(){
        this.getWorlds().forEach(world => {
            world.draw();
        });
    }     

    // constructor
    try {var gl = canvas.getContext('webgl') }
    catch(e) {alert('Exception init: '+e.toString());}
    if(!gl) {alert('Unable to create Web GL context');}
    this.setGl(gl);

}
DirectorController.prototype = new Director;