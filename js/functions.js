"use strict";
function d() {return document};
function $(id) {return d().getElementById(id);}
function dcE(element) {return d().createElement(element);}

var AttributeKind = Object.freeze({"NONE":0,
            "COORDS":1, 
            "COLOR":2,
            "NORMAL":3,
            "TEXTURE":4});
var ShaderKind = Object.freeze({"VERTEX":0,"FRAGMENT":1});   
var TargetKind = Object.freeze({"ARRAY_BUFFER":0,"ELEMENT_ARRAY_BUFFER":1});         
