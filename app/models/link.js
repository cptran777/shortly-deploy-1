var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var crypto = require('crypto');

var linkSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
}, { timestamps: true });

linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

module.exports = function() {

  return mongoose.model('Link', linkSchema);

};
