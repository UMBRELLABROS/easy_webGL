"use strict";
var Director = function(){
    
    // worlds
    
    // getter, setter
    this.setGl = function(newGl,width,height){
        Gl.setGl(newGl,width,height);
    }

} 

var DirectorController = function(canvas){

    var startTime;
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
        renderLoop();
    } 
    
    var renderLoop = function(timestamp){    
        if (!startTime) startTime = timestamp;    
        var timeLap = timestamp - startTime;
        if (timeLap > 20) {
            render();
            startTime = timestamp;
        }
        requestAnimationFrame(renderLoop);
    }

    var render = function(){
        worlds.forEach(world => {
            world.draw();
        });
    }

    // constructor
    try {var gl = canvas.getContext('webgl') }
    catch(e) {alert('Exception init: '+e.toString());}
    if(!gl) {alert('Unable to create Web GL context');}
    this.setGl(gl, canvas.width, canvas.height);

}
DirectorController.prototype = new Director;