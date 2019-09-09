// user

const configure = require('./configure');
const mongoose = require('mongoose');
let user = {
        username: {
            type: String,
            unique: true,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        nickname: {
            type: String,
            default: 'undefined nickname'
        }
} ;

let userSchema = mongoose.Schema(user);

/**
 * must have the required field
 * @param body from req after check
 */
userSchema.statics.newInstance = function (body) {
    //TODO check field
    body.createdDate = +new Date();
    return body;
};
//userSchema.methods.removeConsultant = function () {
//    //TODO check field
//    this.isConsultant = false;
//    this.consultant = null;
//    return this;
//};

mongoose.model(configure.user, userSchema);
