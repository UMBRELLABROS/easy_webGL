"use strict";
var FragmentShader = function(){
    
    this.uniformColorName = null;
    this.uniformDirectDirectionName = null;    
    this.uniformTextureName = null;
    this.varyingColorName = null;   
    this.varyingNormalsName = null;
    this.varyingUVCoordsName = null;    
    this.code;

    // getter, setter
    this.getCode = function(){return this.code;}
    this.setCode = function(newCode){this.code = newCode;}
      
}

var FragmentShaderService = function(item){    

    // functions

    this.buildUniforms = function() {
        var text = "";
        if(this.uniformColorName!=null){            
            text += "uniform vec4 " + this.uniformColorName + ";\n";
        }
        if(this.uniformDirectDirectionName!=null){            
            text += "uniform vec3 " + this.uniformDirectDirectionName + ";\n";
        }
        if(this.uniformTextureName != null){
            text += "uniform sampler2D " + this.uniformTextureName + ";\n";
        }
        return text;
    }

    this.buildVarying = function() {
        var text = "";
        if(this.varyingColorName != null){
            text += "varying vec4 " + this.varyingColorName + ";\n";
        }
        if(this.varyingNormalsName != null){
            text += "varying vec3 " + this.varyingNormalsName + ";\n";
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

        if(this.uniformColorName == null &&              
        this.varyingUVCoordsName == null &&
        this.varyingColorName ==  null){
            text += "gl_FragColor = vec4(1,0,0,1);\n"
        }

        if(this.uniformColorName != null){
            text += "gl_FragColor = " + this.uniformColorName  + ";\n";
        }

        if(this.varyingColorName !=  null &&
        this.varyingNormalsName == null){
            text += "gl_FragColor = " + this.varyingColorName + ";\n"; 
        }

        if(this.varyingNormalsName != null && 
        this.uniformDirectDirectionName != null){
            text +="vec3 normal = normalize("+this.varyingNormalsName+");\n";
            text +="float lightfactor = dot(normal,";
            text += this.uniformDirectDirectionName +");\n"; 
        }

        if(this.varyingColorName != null && 
        this.uniformDirectDirectionName != null &&
        this.varyingUVCoordsName == null){
            text += "gl_FragColor = " + this.varyingColorName + ";\n";
        }
        if(this.varyingColorName == null && 
        this.uniformDirectDirectionName != null &&
        this.varyingUVCoordsName != null){
            text += "gl_FragColor = " 
            + "texture2D("
            + this.uniformTextureName
            + ","
            + this.varyingUVCoordsName
            +")" 
            + ";\n";
        }

        if(this.varyingNormalsName != null
        && this.uniformDirectDirectionName != null){
            text += "gl_FragColor.rgb *= lightfactor;\n"; 
        }

        return text;
    }

    // constructor  
    
    item.getUniforms().forEach(uniform =>{
        if(uniform.getKind() == UniformKind.COLOR){
            this.uniformColorName = uniform.getName();
        }
        if(uniform.getKind() == UniformKind.DIRECTLIGHT){
            this.uniformDirectDirectionName = uniform.getName();
        }
        if(uniform.getKind() == UniformKind.TEXTURE){
            this.uniformTextureName = uniform.getName();
        }
    })  
    
    item.getAttributes().forEach(attribute =>{
        if(attribute.getKind() == AttributeKind.COLOR){
            this.varyingColorName = attribute.getName().replace("a_","v_");
        }
        if(attribute.getKind() == AttributeKind.NORMALS){
            this.varyingNormalsName = attribute.getName().replace("a_","v_");
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