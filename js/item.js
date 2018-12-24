"use strict";
var Item = function(){
   
    
    // attributes
    // uniforms
    this.program;

    // getter, setter
    this.setProgram = function(newProgram){this.program = newProgram;} 
    this.getProgram = function(){return this.program;}
    
}
var ItemService = function(){

    var attributes = [];
    var uniforms = [];

    this.setAttributes = function(newAttributes){
        attributes = newAttributes;                 
    } 
    this.getAttributes = function(){return attributes;} 
    

    this.equals = function(newItem){
        var cntFound = 0
        var newAttributes = newItem.getAttributes();
        this.getAttributes().forEach(attribute => {
            newAttributes.forEach(newAttribute => {
                if(attribute.equals(newAttribute)) cntFound++;            
            });            
        });
        // TODO: check uniforms
        return cntFound == this.getAttributes().length;
    }

    this.create = function(prop, lights, camera){        
        var coords = prop.getCoords();
        var position = prop.getPosition()||[0,0,0];
       
        var coordsAttribute = new AttributeService();               
        coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);
        coordsAttribute.createBuffer();
        this.getAttributes().push(coordsAttribute);

    }

    this.createProgram = function(newProgram){
        if(newProgram != null){
            this.setProgram(newProgram);
            return;
        } 
        var vertexShader = new VertexShaderService(this);
        var vertexShaderCode = vertexShader.getCode();
        var fragmentShader = new FragmentShaderService(this);
        var fragmentShaderCode = fragmentShader.getCode();
        var programService = new ProgramService();     
        var program = programService.create(vertexShaderCode, fragmentShaderCode);  
        this.getAttributes().forEach(attribute => {
            attribute.setLocation(Gl.getAttributeLocation(program, attribute.getName()));
        }); 
        
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

            


   
    
