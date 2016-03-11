// Spec files are scattered through the whole project. Here we're searching
// for them and generate one entry file which will run all the tests.

'use strict';

const jetpack = require('fs-jetpack');
let srcDir = jetpack.cwd('app');

const fileName = 'ui.js';
const fileBanner = "// This file is generated automatically.\n"
  + "// All your modifications to it will be lost (so don't do it).\n";

const rootImport = `import './app.js';\n`;

const whatToInclude = [
  './ui/**/*.js',
  '!./ui/**/*.spec.js'
];

module.exports = function() {
  return srcDir.findAsync('.', { matching: whatToInclude }, 'relativePath')
    .then(function(componentPaths) {
      var fileContent = componentPaths.map(function(path) {
        return `import '${path}';`;
      }).join('\n');
      return srcDir.writeAsync(fileName, fileBanner + rootImport + fileContent);
    })
    .then(function() {
      return srcDir.path(fileName);
    });
};
