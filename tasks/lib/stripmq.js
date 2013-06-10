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

    return node.rules.map(this.visit, this).join('');
};


/**
 * strip media queries
 * @param   {string} input
 * @returns {string} output
 */
module.exports = function(input) {
    var tree = new Parser(input);
    var compiler = new Stringify({});
    return compiler.compile(tree);
};