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

    this.setUniforms = function(newUniforms){
        uniforms = newUniforms;                 
    } 
    this.getUniforms = function(){return uniforms;} 
    

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
        var color = prop.getColor();
        var colorArray = prop.getColorArray();
        var position = prop.getPosition();
       
        var coordsAttribute = new AttributeService();               
        coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);
        coordsAttribute.createBuffer();
        this.getAttributes().push(coordsAttribute);

        if(color != null){
            var colorUniform = new UniformService();
            colorUniform.create(UniformKind.COLOR, "u_color", color);
            this.getUniforms().push(colorUniform);            
        }

        if(colorArray != null){
            var colorAttribute = new AttributeService();
            colorAttribute.create(AttributeKind.COLOR, "a_color", colorArray);
            colorAttribute.createBuffer();
            colorAttribute.setSize(4); //r,g,b,a
            this.getAttributes().push(colorAttribute);            
        }

        if(position != null){
            var matrixUniform = new UniformService();

            var identityMatrix = [1,0,0,0,
                                0,1,0,0,
                                0,0,1,0,
                                0,0,0,1];
            var matrix = identityMatrix;
            if(position != null){
                matrix[12]=position[0];
                matrix[13]=position[1];
                matrix[14]=position[2];
            }

            matrixUniform.create(UniformKind.MATRIX, "u_matrix", matrix);
            this.getUniforms().push(matrixUniform);            
        }

    }

    this.createProgram = function(newProgram){
        var program;
        if(newProgram != null){
            program = newProgram;            
        } 
        else{
            var vertexShader = new VertexShaderService(this);
            var vertexShaderCode = vertexShader.getCode();
            var fragmentShader = new FragmentShaderService(this);
            var fragmentShaderCode = fragmentShader.getCode();
            var programService = new ProgramService();     
            program = programService.create(vertexShaderCode, fragmentShaderCode);  
        }
        var test  = Gl.getAttributeLocation(program,"a_color");

        this.getAttributes().forEach(attribute => {
            attribute.setLocation(Gl.getAttributeLocation(program, attribute.getName()));
        }); 
        this.getUniforms().forEach(uniform => {
            uniform.setLocation(Gl.getUniformLocation(program, uniform.getName()));
        });        
        this.setProgram(program);
    } 

    this.draw = function(){
        Gl.useProgram(this.getProgram());
        
        this.getAttributes().forEach(attribute => {
            attribute.activate();
        });

        this.getUniforms().forEach(uniform => {           
            uniform.activate();            
        });

        Gl.draw();
    }

}   
ItemService.prototype = new Item;

            


   
    
