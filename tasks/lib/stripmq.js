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
    var self = this,
        queries = str.toLowerCase().match(/\((.+)\)/gi),
        matches = [];

    queries.forEach(function(query) {
        // min/max is should be the first property, then the name of the property (like width)
        var keyval = query.replace(/\(|\)/g, "").split(":"),

            // property parts
            property = keyval[0].trim().match(/(min|max)-(.+)$/),

            prop_value, setting_value;

        // no min/max property found
        if(!property) {
            return;
        }

        // find setting values by properties
        if(keyval[0].match(/width/i)) {
            setting_value = self.viewport.width;
        }

        else if(keyval[0].match(/height/i)) {
            setting_value = self.viewport.height;
        }

        else if(keyval[0].match(/device-pixel-ratio/i)) {
            setting_value = self.viewport["device-pixel-ratio"];

            // opera device pixel ratio is different, uses 3/2 for 1.5, kind of weird
            if(keyval[1].match(/[0-9]+\s*\/\s*[0-9]+/)) {
                var values = keyval[1].split("/");
                prop_value = parseInt(values[0],10) / parseInt(values[1],10);
            }
        }

        // parse the value of the property
        prop_value = parseFloat(prop_value || keyval[1]);

        switch(property[1]) {
            case 'min':
                matches.push(setting_value >= prop_value);
                break;

            case 'max':
                matches.push(setting_value <= prop_value);
                break;
        }
    });

    return matches.indexOf(false) === -1;
};


/**
 * virtual viewport
 * @type {{device-pixel-ratio: number, width: number, height: number}}
 */
Stringify.prototype.viewport = {
    "device-pixel-ratio": 1,
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