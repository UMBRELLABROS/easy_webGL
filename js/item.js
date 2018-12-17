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
var ItemService = function(prop, lights, camera){

    this.equals = function(newItem){
        var cntFound = 0
        var newAttributes = newItem.getAttributes();
        attributes.forEach(attribute => {
            newAttributes.forEach(newAttribute => {
                if(attribute.equals(newAttribute)) cntFound++;            
            });            
        });
        // TODO: check uniforms
        return cntFound == attributes.length;
    }

    this.create = function(prop, lights, camera){
        var attributes = [];
        var coords = prop.getCoords();
        var position = prop.getPosition()||[0,0,0];

        var coordsAttribute = new AttributeService();
        coordsAttribute.create(AttributeKind.COORDS,"a_coords",coords);
        attributes.push(coordsAttribute);

        this.setAttributes(attributes);
    }

    this.createProgram = function(newProgram){
        if(newProgram != null) return newProgram;
        var vertexShader = new VertexShaderService(this);
        var vertexShaderCode = vertexShader.getCode();
        var fragmentShader = new FragmentShaderService(this);
        var fragmentShaderCode = fragmentShader.getCode();
        var programService = new ProgramService();     
        var program = programService.create(vertexShaderCode, fragmentShaderCode);   
        this.setProgram(program);
    } 

    this.draw = function(){
        Gl.useProgram(this.getProgram());
        
        this.getAttributes().forEach(attribute => {
            attribute.activate();
        });

        Gl.draw();

    }

}   
ItemService.prototype = new Item;

            


   
    
