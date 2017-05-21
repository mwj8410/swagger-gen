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

let swaggerConfiguration;

module.exports = {
  generate: filePath => {
    const fileNames = flatten(walkSync(filePath));
    let swaggerBlocks = [];

    fileNames.forEach(file => {
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
    });

    // Construct the swagger config paths
    let paths = {};

    swaggerBlocks.forEach(def => {
      let key = Object.keys(def)[0];
      let method = Object.keys(def[key])[0]

      if (typeof paths[key] === 'undefined') {
        paths[key] = {};
      }

      paths[key][method] = def[key][method];
    });

    // Construct the swagger config object
    let swaggerConfig = {
      swagger: '2.0',
      info: {
        version: '1.0.0',
        title: 'Swagger Petstore',
        license: {
          name: 'MIT'
        }
      },
      host: 'petstore.swagger.io',
      basePath: '/',
      schemes: [ 'http' ],
      consumes: [ 'application/json' ],
      produces: [ 'application/json' ],
      paths: paths,
      definitions: {}
    };
console.log(swaggerConfig);
    swaggerConfiguration = swaggerConfig;
    return swaggerConfig;
  },

  host: host => {
    // Host the Swagger configuration
    host.get('/discover' , (req, res) => res.send(swaggerConfiguration));

    // Host static assets
    host.use('/', express.static(path.join(__dirname, 'swagger_ui/')));
  }
};
