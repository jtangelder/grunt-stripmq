'use strict';

var fs = require('fs'),
    Parser = require('css-parse'),
    Stringify = require('css-stringify/lib/identity');


// overwrite media compiler method
Stringify.prototype.media = function(node) {
    // remove DPR!
    if(node.media.match(/device-pixel-ratio/i)) {
        return '';
    }

    var max_width = node.media.match(/max-width:\s*([0-9]+)/i);
    if(this.viewport_width && max_width && parseInt(max_width[1],10) < this.viewport_width) {
        return '';
    }

    return node.rules.map(this.visit, this).join('');
};

Stringify.prototype.viewport_width = 0;


/**
 * strip media queries
 * @param   {string} input
 * @returns {string} output
 */
module.exports = function(input, options) {
    var tree = new Parser(input);
    var compiler = new Stringify({});

    if(options) {
        compiler.viewport_width = options.width || 0;
    }

    return compiler.compile(tree);
};