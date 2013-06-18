'use strict';

var fs = require("fs"),
    stripmq = require('./lib/stripmq');

module.exports = function(grunt) {
    grunt.registerMultiTask("stripmq", "Strip media queries from stylesheets", function () {
        var options = this.options({});

        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });


            // Minify files, warn and fail on error.
            var result;
                var input = fs.readFileSync(src[0], {encoding:'utf-8'});
                result = stripmq(input, options);
            try {
            } catch (e) {
                var err = new Error('Stripping media queries failed.');
                if (e.msg) {
                    err.message += ', ' + e.msg + '.';
                }
                err.origError = e;
                grunt.fail.warn(err);
            }

            // Write the destination file.
            grunt.file.write(f.dest, result);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};