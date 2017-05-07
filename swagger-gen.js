const doctrine = require('doctrine');
const express = require('express');
const extractComments = require('extract-comments');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const flatten = arr => arr.reduce((acc, val) =>
      acc.concat(Array.isArray(val) ? flatten(val) : val), []);
      
const walkSync = dir => fs.readdirSync(dir)
      .map(file => fs.statSync(path.join(dir, file)).isDirectory() 
        ? walkSync(path.join(dir, file)) : path.join(dir, file).replace(/\\/g, '/'));

module.exports = {
  generate: filePath => {
    const fileNames = flatten(walkSync(filePath));
    let swaggerBlocks = [];

    fileNames.forEach(file => {
      // swaggerBlocks = swaggerBlocks
      // .concat(
        // Pull all the comments out of source files
        extractComments(fs.readFileSync(path.resolve(file), 'utf8'))

        // Filter to only swagger doc comments
        .filter(item => item.type === 'block' && item.raw.indexOf('@swagger' > -1))

        // Parse the comments into a usable object
        .map(item => doctrine.parse(item.raw, { unwrap: true }).tags)

        // Transform each object's description attribute into a YML structure
        // and collect them onto the final collection
        .forEach(swaggerComment =>
          yaml.safeLoadAll(swaggerComment[0].description, yamlTag =>
            swaggerBlocks.push(yamlTag)
          )
        );
      // );
    });

    // console.log(swaggerBlocks);
    return swaggerBlocks;
  },
  
  host: host => {

    host.get('/swagger' , (req, res) => {
      fs.readFile(path.join(__dirname, 'swagger_ui/index.html'), 'utf-8', (err, html) => {
        if (err) {
          throw err;
        }

        res.status(200);
        res.set('Content-Type', 'text/html');
        res.send(new Buffer(html));
        return res.end();
      });
    });

    // needs to serve assets
    // needs to serve JSON config
  }
};
