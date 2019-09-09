/**
 *   For
 *   Created by xs at 2018/3/21
 */
"use strict";
const mongoose = require('mongoose');

let schema = {
    req:String,
    res:String,
    createdDate:Number
};

let LogSchema = mongoose.Schema(schema);

LogSchema.statics.newInstance = function (req,res) {
    return {req:req,res:res,createdDate:+ new Date()};
};

mongoose.model('log', LogSchema);
