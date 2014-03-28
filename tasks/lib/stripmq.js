'use strict';

var parse = require('css-parse'),
    stringify = require('css-stringify'),
    mediaQuery = require('css-mediaquery');

function prefixSelectors(options, rules){
    rules.forEach(function(rule){
        rule.selectors.forEach(function(selector, index){
            rule.selectors[index] = options.prefixCSS + (options.prefixWithSpace !== false ? ' ' : '') + selector;
        });
    });
}


function stripMediaQueries(ast, options) {
    ast.stylesheet.rules = ast.stylesheet.rules.reduce(function(rules, rule) {
        if (rule.type === 'media') {
            if (mediaQuery.match(rule.media, options)) {
                if(options.prefixCSS.length > 0){
                    prefixSelectors(options,rule);
                }

                rules.push.apply(rules, rule.rules);
            }
        } else {
            if (options.ignoreBase !== true) {
                rules.push(rule);
            }
        }
        return rules;
    }, []);
    return ast;
}

/**
 * strip media queries
 * @param   {string} input
 * @returns {string} output
 */
function StripMQ(input, options) {

    options = {
        type:            options.type || 'screen',
        width:           options.width || 1024,
        'device-width':  options['device-width'] || options.width || 1024,
        height:          options.height || 768,
        'device-height': options['device-height'] || options.height || 768,
        resolution:      options.resolution || '1dppx',
        orientation:     options.orientation || 'landscape',
        'aspect-ratio':  options['aspect-ratio'] || options.width / options.height || 1024 / 768,
        color:           options.color || 3,
        ignoreBase:      (options.ignoreBase === true),
        prefixCSS:       options.prefixCSS || '',
        prefixWithSpace: (options.prefixWithSpace !== false)
    };

    var tree = parse(input);
    tree = stripMediaQueries(tree, options);
    return stringify(tree);
}

module.exports = StripMQ;