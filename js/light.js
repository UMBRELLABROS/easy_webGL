"use strict;"
var Light = function () {
    this.kind;
    this.direction = [];
    this.position = [];
    this.velocity = [];
    this.rotation = [];


    // getter, setter
    this.getKind = function () { return this.kind; }
    this.setKind = function (newKind) { this.kind = newKind; }

}

var LightService = function () {

    this.dynamic = new Dynamic();

    // getter, setter
    this.getDirection = function () { return this.direction; }
    this.setDirection = function (newDirection) {
        this.direction = m4.normalize(newDirection);
    }

}
LightService.prototype = new Light;