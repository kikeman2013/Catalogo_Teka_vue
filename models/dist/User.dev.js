"use strict";

var mongoose = require('mongoose');

var bcryptjs = require('bcryptjs');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: String,
  email: String,
  password: String
});
var User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = function (newUser, callback) {
  bcryptjs.hash(newUser.password, salt, function (error, hash) {
    // almacenamiento del password encriptado
    var newUserResource = newUser;
    newUserResource.password = hash;
    newUserResource.save(callback);
  });
};