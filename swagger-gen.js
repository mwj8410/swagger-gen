const fs = require('fs');
const path = require('path');


const flatten = arr => arr.reduce((acc, val) =>
      acc.concat(Array.isArray(val) ? flatten(val) : val), []);
      
const walkSync = dir => fs.readdirSync(dir)
      .map(file => fs.statSync(path.join(dir, file)).isDirectory() 
        ? walkSync(path.join(dir, file)) : path.join(dir, file).replace(/\\/g, '/'));

module.exports = {
  generate: filePath => {
    console.log(flatten(walkSync(filePath)));
    
    return [];
  },
  
  host: port => {
    
  }
};
