'use strict';

const express = require('express');
const http = require('http');

const port = process.env.PORT || 7203;

const app = express();
app.use(express.static('./dist/'));

const server = http.createServer(app);
server.listen(port);