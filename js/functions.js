"use strict";
function d() {return document};
function $(id) {return d().getElementById(id);}
function dcE(element) {return d().createElement(element);}

Array.prototype.equals = function (array) {
    if (!array)
        return false;
    if (this.length != array.length)
        return false;
    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] != array[i]) return false;        
    }       
    return true;
}

Float32Array.prototype.equals = function (array){
    if (!array)
        return false;
    if (this.length != array.length)
        return false;
    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] != array[i]) return false;        
    }       
    return true;
}

var AttributeKind = Object.freeze({"NONE":0,
            "COORDS":1, 
            "COLOR":2,
            "NORMAL":3,
            "TEXTURE":4});
var UniformKind = Object.freeze({"NONE":0,
            "COLOR":1,
            "MATRIX":2});
var ShaderKind = Object.freeze({"VERTEX":0,"FRAGMENT":1});   
var TargetKind = Object.freeze({"ARRAY_BUFFER":0,"ELEMENT_ARRAY_BUFFER":1});        

