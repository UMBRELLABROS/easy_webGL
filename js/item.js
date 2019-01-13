"use strict";
var Item = function(){
       
    // attributes
    // uniforms
    this.program;
    this.countIndices; 
    this.countElements;    
    this.drawKind = DrawKind.TRIANGLE;

    // getter, setter
    this.setProgram = function(newProgram){this.program = newProgram;} 
    this.getProgram = function(){return this.program;}

    this.setCountIndices = function(newCount){this.countIndices = newCount;}
    this.getCountIndices = function(){return this.countIndices;}

    this.setCountElements = function(newCount){this.countElements = newCount;}
    this.getCountElements = function(){return this.countElements;}
    
    this.setDrawKind = function(newDrawKind){this.drawKind = newDrawKind;}
    this.getDrawKind = function(){return this.drawKind;}
}
var ItemService = function(){

    var attributes = [];
    var uniforms = [];
    var actualRotation = [0,0,0];
   
    // getter, setter
    this.setAttributes = function(newAttributes){
        attributes = newAttributes;                 
    } 
    this.getAttributes = function(){return attributes;} 

    this.setUniforms = function(newUniforms){
        uniforms = newUniforms;                 
    } 
    this.getUniforms = function(){return uniforms;} 

    this.getActualRotation = function(){return actualRotation;}
    this.setActualRotation = function(newActualRotation){
        actualRotation = newActualRotation;
    }
    


    this.equals = function(newItem){
        var cntFound = 0
        var newAttributes = newItem.getAttributes();
        this.getAttributes().forEach(attribute => {
            newAttributes.forEach(newAttribute => {
                if(!attribute.equals(newAttribute)) {
                    cntFound++;            
                    return;
                }
            });            
        });
        return cntFound>0?false:true;
        // TODO: check uniforms        
    }

    this.create = function(prop, lights, camera){        
        var coords = prop.getCoords();
        var color = prop.getColor();
        var colorArray = prop.getColorArray();
        var position = prop.getPosition();
        var normals = prop.getNormals(); 
        var indices = prop.getIndices();   
        var image = prop.image;
        var uvCoords = prop.uvCoords;   
        var geometry = prop.geometry; 
        this.setVelocity = prop.setVelocity;
        this.getVelocity = prop.getVelocity;
        this.setRotation = prop.setRotation;
        this.getRotation = prop.getRotation;

        var directLight = null;
        lights.forEach(light => {
            if(light.getKind() == LightKind.DIRECT){
                directLight = light.getDirection();                
            }            
        });
       
        if(geometry != null){
            coords = geometry.coords;
            indices = geometry.indices;
            uvCoords = geometry.uvCoords;
        }

        if(coords != null){
            var coordsAttribute = new AttributeService();   
            this.setCountIndices(coords.length/3);            
            coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);
            coordsAttribute.createBuffer();
            this.getAttributes().push(coordsAttribute);
        }

        if(indices != null){
            var indexAttribute = new AttributeService();
            indexAttribute.create(AttributeKind.INDICES, "a_indices", indices);
            indexAttribute.createBuffer();         
            this.getAttributes().push(indexAttribute); 
            this.setDrawKind(DrawKind.ELEMENT);
            this.setCountElements(indices.length);
        }

        if(normals != null){
            var normalAttribute = new AttributeService();            
            normalAttribute.create(AttributeKind.NORMALS, "a_normals", normals);            
            normalAttribute.createBuffer();         
            this.getAttributes().push(normalAttribute); 
        }        

        if(directLight != null){
            var directLightUniform = new UniformService();
            directLightUniform.create(UniformKind.DIRECTLIGHT, "u_direct_direction", directLight);
            this.getUniforms().push(directLightUniform);
        }

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
            
            var matrix = m4.identity();
            if(position != null){
                matrix = m4.translate(matrix,position[0],position[1],position[2])               
            }

            matrixUniform.create(UniformKind.MATRIX, "u_matrix", matrix);
            this.getUniforms().push(matrixUniform);            
        }

        if(uvCoords != null && image!= null){
            var uvCoordsAttribute = new AttributeService();
            uvCoordsAttribute.create(AttributeKind.UVCOORDS, "a_uv_coords", uvCoords);
            uvCoordsAttribute.createBuffer();
            uvCoordsAttribute.setSize(2); //u,v
            this.getAttributes().push(uvCoordsAttribute); 
        }
        
        if(image != null && uvCoords != null){
            var texture = new TextureService();
            texture.preLoad();

            var textureUniform = new UniformService();
            textureUniform.create(UniformKind.TEXTURE, "u_texture", texture);
            this.getUniforms().push(textureUniform);

            texture.load(image);                        
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
            if(uniform.getKind() == UniformKind.MATRIX){

                var matrix = m4.identity()
                
                matrix = m4.multiply(m4.projection(Gl.getDisplay()[0],Gl.getDisplay()[1],100),matrix);

                var velocity = this.getVelocity();
                matrix = m4.translate(matrix, velocity[0]||0, velocity[1]||0, velocity[2]||0);

                var rotation = this.getRotation();
                var actualRoation = this.getActualRotation();
                actualRoation[0]+=rotation[0]||0;
                actualRoation[1]+=rotation[1]||0;
                actualRoation[2]+=rotation[2]||0;
                matrix = m4.xRotate(matrix,actualRoation[0]);
                matrix = m4.yRotate(matrix,actualRoation[1]);
                matrix = m4.zRotate(matrix,actualRoation[2]);
                this.setActualRotation(actualRoation)                

                uniform.setValue(matrix);
            }       
            
            uniform.activate();            
        });

        if(this.getDrawKind()==DrawKind.TRIANGLE){
            Gl.draw(this.getCountIndices());
        }
        else{
            Gl.drawElement(this.getCountElements());
        }
    }

}   
ItemService.prototype = new Item;

            


   
    
