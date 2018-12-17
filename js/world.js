"use strict";
var World = function(){
    var items = [];
    
    // getter, setter
    this.setItems = function(newItems){items = newItems;}

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
                    var item = this.createItem(prop, lights, camera);
                    var program = this.getProgram(item);
                    item.createProgram(program);                    
                    items.push(item);
                });
            }
            else{
                var item = this.createItem(prop, lights, []);
                var program = this.getProgram(item);
                item.createProgram(program); 
                items.push(item);
            }
        });
        this.setItems(items);

    }

    this.createItem = function(prop, lights, camera){ 
        var item = new ItemService();       
        item.create(prop,lights,camera);        
        return item;
    }

    this.getProgram = function(newItem){
        this.getItems().forEach(item => {
            if(item.equals(newItem)){
                return item.getProgram();
            }
        });
        return null;
    }

    this.draw = function(){
        this.getItems().forEach(item => {
            item.draw();
        });
    }
}
WorldService.prototype = new World;