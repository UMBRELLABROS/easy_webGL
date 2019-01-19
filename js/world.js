"use strict";
var World = function () {


}

var WorldService = function () {

    var items = [];

    // getter, setter
    this.getItems = function () { return items; }
    this.setItems = function (newItems) { items = newItems; }


    this.createItems = function (newScene) {
        // build items from scene        
        var props = newScene.getProps();
        var lights = newScene.getLights();
        var cameras = newScene.getCameras();

        props.forEach(prop => {

            var item = new ItemService();
            item.create(prop, lights, cameras);
            var program = this.getProgram(item);
            item.createProgram(program);
            this.getItems().push(item);

        });

    }

    this.getProgram = function (newItem) {
        var items = this.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i].equals(newItem)) {
                return items[i].getProgram();
            }
        };
        return null;
    }

    this.draw = function () {
        this.getItems().forEach(item => {
            item.draw();
        });
    }
}
WorldService.prototype = new World;