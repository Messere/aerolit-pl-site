'use strict';

const express = require('express');
const http = require('http');

const port = process.env.PORT || 7203;

const app = express();

app.use(express.static('./public/'));
app.use(express.static('./src/'));

const server = http.createServer(app);

server.listen(port);