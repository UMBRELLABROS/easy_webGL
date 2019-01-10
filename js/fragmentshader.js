"use strict";
var FragmentShader = function(){
    
    this.uniformColorName = null;
    this.uniformDirectDirectionName = null;    
    this.uniformTextureName = null;
    this.varyingColorName = null;   
    this.varyingNormalsName = null;
    this.varyingUVCoordsName = null;    
    this.code ;

    // getter, setter
    this.getCode = function(){return this.code;}
    this.setCode = function(newCode){this.code = newCode;}
    
    this.getVaryingColorName = function(){return this.varyingColorName;} 
    this.setVaryingColorName = function(newVaryingColorName){
        this.varyingColorName = newVaryingColorName;
    }

    this.getVaryingNormalsName = function(){return this.varyingNormalsName;} 
    this.setVaryingNormalsName = function(newVaryingNormalsName){
        this.varyingNormalsName = newVaryingNormalsName;
    }

    this.getUniformColorName = function(){return this.uniformColorName;} 
    this.setUniformColorName = function(newUniformColorName){
        this.uniformColorName = newUniformColorName;
    }

    this.getUniformDirectDirectionName = function(){
        return this.uniformDirectDirectionName;
    } 
    this.setUniformDirectDirectionName = function(newUniformDirectDirectionName){
        this.uniformDirectDirectionName = newUniformDirectDirectionName;
    }
}

var FragmentShaderService = function(item){    

    var varyings = [];
    var uniforms = [];
    var attributes = [];

    this.getVaryings = function(){return varyings;}
    this.setVaryings = function(newVaryings){
        varyings = newVaryings;
    }

    this.getUniforms = function(){return uniforms;}
    this.setUniforms = function(newUniforms){
        uniforms = newUniforms;
    }

    this.getAttributes = function(){return attributes;}
    this.setAttributes = function(newAttributes){
        attributes = newAttributes;
    }    

    // functions

    this.buildUniforms = function() {
        var text = "";
        if(this.getUniformColorName()!=null){            
            text += "uniform vec4 " + this.getUniformColorName() + ";\n";
        }
        if(this.getUniformDirectDirectionName()!=null){            
            text += "uniform vec3 " + this.getUniformDirectDirectionName() + ";\n";
        }
        if(this.uniformTextureName != null){
            text += "uniform sampler2D " + this.uniformTextureName + ";\n";
        }
        return text;
    }

    this.buildVarying = function() {
        var text = "";
        if(this.getVaryingColorName() != null){
            text += "varying vec4 " + this.getVaryingColorName() + ";\n";
        }
        if(this.getVaryingNormalsName() != null){
            text += "varying vec3 " + this.getVaryingNormalsName() + ";\n";
        }
        if(this.varyingUVCoordsName != null){
            text += "varying vec2 " + this.varyingUVCoordsName + ";\n";
        }
        return text;
    }

    this.buildMain = function(){
        var text = "";
        text += "void main(){\n";
        text += this.buildInnerMain();
        text += "}\n";
        return text;
    }

    this.buildInnerMain = function(){
        var text = "";
        if( this.getAttributes().length == 1 &&
            this.getUniforms().length == 0){
            text += "gl_FragColor = vec4(1,0,0,1);\n"
        }
        if( this.getAttributes().length == 1 &&
            this.getUniforms().length > 0){
                this.getUniforms().forEach(uniform => {
                    if(uniform.getKind() == UniformKind.COLOR){
                        text += "gl_FragColor = " + uniform.getName() + ";\n";        
                    }                    
                });            
        }
        if( this.getAttributes().length > 0 &&
            this.getUniforms().length == 0){
                this.getAttributes().forEach(attribute =>{
                    if(attribute.getKind() == AttributeKind.COLOR){
                        text += "gl_FragColor = " + attribute.getName().replace("a_","v_") + ";\n";    
                    }
                });
        }
        if( this.getAttributes().length > 0 &&
            this.getUniforms().length > 0){
                if(this.getVaryingNormalsName()!=null
                    && this.getUniformDirectDirectionName()!=null){                     
                    text +="vec3 normal = normalize("+this.getVaryingNormalsName()+");\n";
                    text +="float lightfactor = dot(normal,";
                    text += this.getUniformDirectDirectionName() +");\n";                    
                }
                if(this.varyingColorName != null
                    && this.varyingUVCoordsName == null){
                        text += "gl_FragColor = " + this.varyingColorName + ";\n";
                }
                if(this.varyingUVCoordsName != null){
                    text += "gl_FragColor = texture2D("
                        + this.uniformTextureName + ","
                        + this.varyingUVCoordsName + ");\n";
                }                
                if(this.getVaryingNormalsName()!=null
                    && this.getUniformDirectDirectionName()!=null){
                    text += "gl_FragColor.rgb *= lightfactor;\n"; 
                }

        }
        return text;
    }

    // constructor  
    this.setUniforms(item.getUniforms());
    this.getUniforms().forEach(uniform =>{
        if(uniform.getKind() == UniformKind.COLOR){
            this.setUniformColorName(uniform.getName());
        }
        if(uniform.getKind() == UniformKind.DIRECTLIGHT){
            this.setUniformDirectDirectionName(uniform.getName());
        }
        if(uniform.getKind() == UniformKind.TEXTURE){
            this.uniformTextureName = uniform.getName();
        }
    })  

    this.setAttributes(item.getAttributes());
    this.getAttributes().forEach(attribute =>{
        if(attribute.getKind() == AttributeKind.COLOR){
            this.setVaryingColorName(attribute.getName().replace("a_","v_"));
        }
        if(attribute.getKind() == AttributeKind.NORMALS){
            this.setVaryingNormalsName(attribute.getName().replace("a_","v_"));
        }
        if(attribute.getKind() == AttributeKind.UVCOORDS){
            this.varyingUVCoordsName = attribute.getName().replace("a_","v_");
        }
    }) 

    var shaderCode =  "precision mediump float;\n"   
    shaderCode += this.buildUniforms();
    shaderCode += this.buildVarying();
    shaderCode += this.buildMain();
    this.setCode(shaderCode);
}
FragmentShaderService.prototype = new FragmentShader;