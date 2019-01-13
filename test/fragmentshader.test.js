describe('FragmentShader', () =>{
    let fragmentShader = null;
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
            fragmentShader = new FragmentShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'precision mediump float;\n'+
            'void main(){\n'+
            'gl_FragColor = vec4(1,0,0,1);\n'+
            '}\n';
            expect(fragmentShader.getCode()).to.equal(text);
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
            fragmentShader = new FragmentShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'precision mediump float;\n'+
            'uniform vec4 u_color;\n'+
            'void main(){\n'+
            'gl_FragColor = u_color;\n'+
            '}\n';        
            expect(fragmentShader.getCode()).to.equal(text);
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
            fragmentShader = new FragmentShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'precision mediump float;\n'+
            'varying vec4 v_color;\n'+
            'void main(){\n'+
            'gl_FragColor = v_color;\n'+
            '}\n'; 
            expect(fragmentShader.getCode()).to.equal(text);
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
            fragmentShader = new FragmentShaderService(item);
        });
        
        it('should create correct code', () =>{
            let text = 'precision mediump float;\n'+
            'void main(){\n'+
            'gl_FragColor = vec4(1,0,0,1);\n'+
            '}\n';
            expect(fragmentShader.getCode()).to.equal(text);
        });
    }); 

    describe('simple colorArray directLight shader',() =>{  
        beforeEach( () => {
            var prop = new PropService({coords:[-0.25,-0.25,0,0.25,-0.25,0,0,0.25,0],
                colorArray:[1.0,0.0,0.0,1.0,
                    0.0,1.0,0.0,1.0,
                    0.0,0.0,1.0,1.0],
                normals:[1,0,0, 1,0,0, 1,0,0]});
            var coords = prop.getCoords();    
            var coordsAttribute = new AttributeService();               
            coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);   

            var normals = prop.getCoords();    
            var normalsAttribute = new AttributeService();               
            normalsAttribute.create(AttributeKind.NORMALS, "a_normals", normals); 
            
            var colorArray = prop.getColorArray();
            var colorAttribute = new AttributeService();
            colorAttribute.create(AttributeKind.COLOR, "a_color", colorArray);   
            
            var matrixUniform = new UniformService();
            var identityMatrix = [1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1];
            var matrix = identityMatrix;
            matrixUniform.create(UniformKind.MATRIX, "u_matrix", matrix);

            var directLightUniform = new UniformService();            
            var direction = [1,1,1];
            directLightUniform.create(UniformKind.DIRECTLIGHT, "u_direct_direction", direction); 

            item.setAttributes([coordsAttribute, colorAttribute, normalsAttribute]);
            item.setUniforms([matrixUniform, directLightUniform]);

            fragmentShader = new FragmentShaderService(item);
        });

        it('should create correct code', () =>{
            let text = 'precision mediump float;\n'+
            'uniform vec3 u_direct_direction;\n'+
            'varying vec4 v_color;\n'+
            'varying vec3 v_normals;\n'+
            'void main(){\n'+
            'vec3 normal = normalize(v_normals);\n'+
            'float lightfactor = dot(normal,u_direct_direction);\n'+
            'gl_FragColor = v_color;\n'+
            'gl_FragColor.rgb *= lightfactor;\n'+
            '}\n';
            expect(fragmentShader.getCode()).to.equal(text);
        });
    });  

    describe('simple texture directLight shader',() =>{  
        beforeEach( () => {
            var prop = new PropService({coords:[-0.25,-0.25,0,0.25,-0.25,0,0,0.25,0],
                uvCoords:[1.0,0.0,0.0,1.0,
                    0.0,1.0,0.0,1.0,
                    0.0,0.0,1.0,1.0],
                normals:[1,0,0, 1,0,0, 1,0,0]});
                var coords = prop.getCoords();    
                var coordsAttribute = new AttributeService();               
                coordsAttribute.create(AttributeKind.COORDS, "a_coords", coords);   
    
                var normals = prop.getCoords();    
                var normalsAttribute = new AttributeService();               
                normalsAttribute.create(AttributeKind.NORMALS, "a_normals", normals); 
                
                var uvCoordsArray = prop.uvCoords;
                var uvCoordsAtribute = new AttributeService();
                uvCoordsAtribute.create(AttributeKind.UVCOORDS, "a_uvcoords", uvCoordsArray);   
                
                var matrixUniform = new UniformService();
                var identityMatrix = [1,0,0,0,
                    0,1,0,0,
                    0,0,1,0,
                    0,0,0,1];
                var matrix = identityMatrix;
                matrixUniform.create(UniformKind.MATRIX, "u_matrix", matrix);
    
                var directLightUniform = new UniformService();            
                var direction = [1,1,1];
                directLightUniform.create(UniformKind.DIRECTLIGHT, "u_direct_direction", direction); 
    
                var textureUniform = new UniformService();
                textureUniform.create(UniformKind.TEXTURE, "u_texture", null);
    
                item.setAttributes([coordsAttribute, uvCoordsAtribute, normalsAttribute]);
                item.setUniforms([matrixUniform, directLightUniform, textureUniform]);

            fragmentShader = new FragmentShaderService(item);
        });

        it('should create correct code', () =>{
            let text = 'precision mediump float;\n'+
            'uniform vec3 u_direct_direction;\n'+
            'uniform sampler2D u_texture;\n'+
            'varying vec3 v_normals;\n'+
            'varying vec2 v_uvcoords;\n'+
            'void main(){\n'+
            'vec3 normal = normalize(v_normals);\n'+
            'float lightfactor = dot(normal,u_direct_direction);\n'+
            'gl_FragColor = texture2D(u_texture,v_uvcoords);\n'+
            'gl_FragColor.rgb *= lightfactor;\n'+
            '}\n';
            expect(fragmentShader.getCode()).to.equal(text);
        });
    });  

});