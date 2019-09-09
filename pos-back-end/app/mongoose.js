"use strict";
const configure = require('./../configure');
const mongoose = require('mongoose');

//TODO read from dir
require('./schema/user');
require('./schema/log');

mongoose.connect(configure.mongoose.url,{
    useMongoClient:true
});
mongoose.connection.on('connected',function () {
    console.log(`${Date()} mongoose connected to ${configure.mongoose.url}`);
});

mongoose.connection.on('error',function (err) {
    console.error(`${Date()} mongoose error ${configure.mongoose.url} ${err}`)
});

mongoose.connection.on('disconnected',function () {
    console.error(`${Date()} mongoose disconnected ${configure.mongoose.url}`)
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
