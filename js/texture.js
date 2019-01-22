"use strict;"
var Texture = function () {
    this.images = [];
    this.image;
    this.texture;
    /*
    var count;
    this.getCount = function () { return count; }
    this.setCount = function (newCount) { count = newCount; }
    */

}

var TextureService = function () {

    this.preLoad = function () {
        this.texture = Gl.createTexture();
    }

    this.count = function (newImageSrc) {
        if (this.images.indexOf(newImageSrc) == -1) {
            this.images.push(newImageSrc);
        }
        return this.images.length - 1;
    }

    this.load = function (newImageSrc) {
        Gl.setTexture(this.texture, newImageSrc);
    }

}
TextureService.prototype = new Texture;