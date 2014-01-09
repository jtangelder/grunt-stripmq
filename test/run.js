var fs = require('fs'),
    stripmq = require('../tasks/lib/stripmq');

var input = fs.readFileSync('test/input.css', {encoding:'utf-8'});
var result = stripmq(input, {width: 1000, type: 'screen'});
console.log(result);
