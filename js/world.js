"use strict";
var World = function(){
    var items = [];
    
    // getter, setter
    this.setItems = function(newItems){itesm = newItems;}

    this.getItems = function(){return items;}

    // constructor
    

}

var WorldService = function(){

    this.createItems = function(newScene){
        // build items from scene
        var items= [];
        var props = newScene.getProps();
        var lights = newScene.getLights();
        var cameras = newScene.getCameras();

        props.forEach(prop => {
            if(cameras.length > 0){
                cameras.forEach(camera =>{
                    items.push(this.createItem(prop, lights, camera));
                });
            }
            else{
                items.push(this.createItem(prop, lights, []));
            }
        });
        this.setItems(items);

    }

    this.createItem = function(prop, lights, camera){ 
        var item = new ItemService();       
        return item.create(prop,lights,camera);        
    }
}
WorldService.prototype = new World;