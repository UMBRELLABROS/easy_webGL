"use strict;"
var Light = function () {
    this.kind;
    this.direction = [];
    this.position = [];


    // getter, setter
    this.getKind = function () { return this.kind; }
    this.setKind = function (newKind) { this.kind = newKind; }

}

var LightService = function () {
    // getter, setter
    this.getDirection = function () { return this.direction; }
    this.setDirection = function (newDirection) {
        this.direction = m4.normalize(newDirection);
    }

}
LightService.prototype = new Light;