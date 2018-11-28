"use strict";

var Triangle = function(params){
    
    // constructor
    this.parseParams(params);
        
    // getter, setrer               
    this.getCoords = function(){
        var dimension = this.getDimension();
        var w = dimension[0];
        var h = dimension[1];
        var position = this.getPosition();
        var x = position[0];
        var y = position[1];
    
        var coords = [-w/2 + x,- h/2 + y, 0,
                    w/2 + x, -h/2 + y, 0, 
                    0 + x, h/2 + y, 0];
        return coords;
    }

}
Triangle.prototype = new BaseObject;