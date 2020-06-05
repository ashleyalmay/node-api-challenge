const express = require('express');
const server = express();

const actionRouter = require('./router/actionRouter');
const projectRouter = require('./router/projectRouter');

const helmet = require('helmet');
const morgan = require('morgan');

server.use(logger);
server.use(helmet());
server.use(morgan('dev'));
server.use(express.json())

server.use('/api/actions', actionRouter);
server.use('/api/projects', projectRouter);

server.get('/', (req, res) => {
    res.send("<h1>API Sprint Time!</h1>")
})

function logger(req, res, next) {
    console.log(req.method)
    console.log(req.url)
    console.log(Date.now())
    next();
  }

module.exports = server