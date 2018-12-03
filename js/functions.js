"use strict";
function d() {return document};
function $(id) {return d().getElementById(id);}
function dcE(element) {return d().createElement(element);}

var AttributeKind = Object.freeze({"NONE":0,
            "POSITION":1, 
            "COLOR":2,
            "NORMAL":3,
            "TEXTURE":4});
