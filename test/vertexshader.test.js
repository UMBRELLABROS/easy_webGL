describe('VertexShader', () =>{
    let vertexShader = null;
    let item = null;

    beforeEach( () => {
        var canvas = dcE('canvas');
        var director = new DirectorController(canvas);
        item = new ItemService();        
    }); 

    describe('simple shader',() =>{
        beforeEach( () => {
            var prop = new PropService({coords:[-0.25,-0.25,0,0.25,-0.25,0,0,0.25,0]});
            var coords = prop.getCoords();    
            var coordsAttribute = new AttributeService();               
            coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);            
            item.setAttributes([coordsAttribute]);
            vertexShader = new VertexShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'attribute vec3 a_coords;\n'+
            'void main(){\n'+
            'gl_Position = vec4(a_coords,1);\n'+
            '}\n';
            expect(vertexShader.getCode()).to.equal(text);
        });
    });

    describe('simple color shader',() =>{  
        beforeEach( () => {
            var prop = new PropService({coords:[-0.25,-0.25,0,0.25,-0.25,0,0,0.25,0],
                color:[0.6,0.6,0.6,1.0]});
            var coords = prop.getCoords();    
            var coordsAttribute = new AttributeService();               
            coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);   
            
            var color = prop.getColor();
            var colorUniform = new UniformService();
            colorUniform.create(UniformKind.COLOR, "u_color", color);

            item.setUniforms([colorUniform]);            
            item.setAttributes([coordsAttribute]);
            vertexShader = new VertexShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'attribute vec3 a_coords;\n'+
            'void main(){\n'+
            'gl_Position = vec4(a_coords,1);\n'+
            '}\n';        
            expect(vertexShader.getCode()).to.equal(text);
        });
    });

    describe('simple colorArray shader',() =>{  
        beforeEach( () => {
            var prop = new PropService({coords:[-0.25,-0.25,0,0.25,-0.25,0,0,0.25,0],
                colorArray:[1.0,0.0,0.0,1.0,
                    0.0,1.0,0.0,1.0,
                    0.0,0.0,1.0,1.0]});
            var coords = prop.getCoords();    
            var coordsAttribute = new AttributeService();               
            coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);   
            
            var colorArray = prop.getColorArray();
            var colorAttribute = new AttributeService();
            colorAttribute.create(AttributeKind.COLOR, "a_color", colorArray);            

            item.setAttributes([coordsAttribute, colorAttribute]);
            vertexShader = new VertexShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'attribute vec3 a_coords;\n'+
            'attribute vec4 a_color;\n'+
            'varying vec4 v_color;\n'+
            'void main(){\n'+
            'gl_Position = vec4(a_coords,1);\n'+
            'v_color=a_color;\n'+
            '}\n';
            expect(vertexShader.getCode()).to.equal(text);
        });
    });    

    describe('simple position shader',() =>{  
        beforeEach( () => {
            var prop = new PropService({coords:[-0.25,-0.25,0,0.25,-0.25,0,0,0.25,0],
                position:[0.0,0.5,0.0]});
            var coords = prop.getCoords();    
            var coordsAttribute = new AttributeService();               
            coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);   
                        
            var matrixUniform = new UniformService();
            var identityMatrix = [1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1];
            var matrix = identityMatrix;
            matrixUniform.create(UniformKind.MATRIX, "u_matrix", matrix);            

            item.setUniforms([matrixUniform]);
            item.setAttributes([coordsAttribute]);
            vertexShader = new VertexShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'attribute vec4 a_coords;\n'+
            'uniform mat4 u_matrix;\n'+
            'void main(){\n'+
            'gl_Position = u_matrix * a_coords;\n'+
            '}\n';
            expect(vertexShader.getCode()).to.equal(text);
        });
    }); 


});