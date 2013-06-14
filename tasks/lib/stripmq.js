'use strict';

var fs = require('fs'),
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
    var queries = str.toLowerCase()
        .match(/(max-width|min-width|max-height|min-height|min-device-pixel-ratio|max-device-pixel-ratio):\s*([0-9\.]+)/gi),

        v = this.viewport,
        matches = [];

    queries.forEach(function(query) {
        var property = query.split(":")[0].trim(),
            value = parseFloat(query.split(":")[1]);

        switch(property) {
            case 'max-width':
                matches.push(v.width < value);
                break;

            case 'min-width':
                matches.push(v.width > value);
                break;

            case 'max-height':
                matches.push(v.height < value);
                break;

            case 'min-height':
                matches.push(v.height > value);
                break;

            case 'min-device-pixel-ratio':
                matches.push(v.pixelRatio > value);
                break;

            case 'max-device-pixel-ratio':
                matches.push(v.pixelRatio < value);
                break;
        }
    });

    return matches.indexOf(false) === -1;
};


/**
 * virtual viewport
 * @type {{pixelRatio: number, width: number, height: number}}
 */
Stringify.prototype.viewport = {
    pixelRatio: 1,
    width: 1000,
    height: 768
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
        compiler.viewport_width = options.width || 0;
    }

    return compiler.compile(tree);
}

module.exports = StripMQ;