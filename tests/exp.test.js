const express = require('express');
const sg = require('../swagger-gen');

let host = express();
let server;

sg.generate('./example');
sg.host(host);
server = host.listen(31337);
