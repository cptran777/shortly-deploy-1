var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  username: String,
  password: String
}, { timestamps: true });

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(password, callback) {
  bcrypt.hash(password, null, null, function(err, hash) {
    callback(err, hash);
  });
};

module.exports = function() {

  return mongoose.model('User', userSchema);

};
