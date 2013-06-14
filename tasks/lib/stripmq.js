'use strict';

var fs = require('fs'),
    _ = require('underscore'),
    Parser = require('css-parse'),
    Stringify = require('css-stringify/lib/compress');


// overwrite media compiler method
Stringify.prototype.media = function(node) {
    if(!this.matchMedia(node.media)) {
        return '';
    }

    return node.rules.map(this.visit, this).join('');
};


/**
 * parse media queries
 * @param str
 * @returns {boolean}
 */
Stringify.prototype.matchMedia = function(str) {
    var queries = str.toLowerCase().match(/(max|min)-(width|height|device-pixel-ratio):\s*([0-9\.]+)/gi),
        v = this.viewport,
        matches = [];

    queries.forEach(function(query) {
        // min/max is should be the first property, then the name of the property (like width)
        var property = query.split(":")[0].trim().match(/^(min|max)-(.+)$/),
            // parse the value of the property
            value = parseFloat(query.split(":")[1]);

        if(property[1] === 'min') {
            matches.push(v[property[2]] >= value);
        } else if(property[1] === 'max') {
            matches.push(v[property[2]] <= value);
        }
    });

    return matches.indexOf(false) === -1;
};


/**
 * virtual viewport
 * @type {{device-pixel-ratio: number, width: number, height: number}}
 */
Stringify.prototype.viewport = {
    "device-pixel-ratio": 2,
    "width": 1024,
    "height": 768
};


/**
 * strip media queries
 * @param   {string} input
 * @returns {string} output
 */
function StripMQ(input, options) {
    var tree = new Parser(input);
    var compiler = new Stringify({});

    if(options) {
        _.extend(compiler.viewport, options);
    }

    return compiler.compile(tree);
}

module.exports = StripMQ;