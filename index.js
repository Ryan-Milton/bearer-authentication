'use strict';

require('dotenv').config();

require('babel-polyfill');
require('babel-register');

const mongoose = require('mongoose');
mongoose.connect(process.env.MOGODB_URI, { useNewUrlParser: true });

require('./lab/src/app.js').start(process.env.PORT);