var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user')();
var Link = require('../app/models/link')();
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, results) {
    res.status(200).send(results);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.find({url: uri}, function(err, results) {
    if (err) {
      console.log(err);
    } else if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
          var newLink = new Link({
            url: uri,
            title: title,
            baseUrl: req.headers.origin,
          });
          newLink.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).send(newLink);
            }
          });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length < 1) {
        res.redirect('/login');
      } else {
        result[0].comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, result[0]);
          } else {
            res.redirect('/');
          }
        });
      }
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var myUser = new User({ username: username });
  myUser.hashPassword(password, function(err, hash) {
    if (err) {
      console.log(err);
    } else {
      myUser.password = hash;
      User.find({ username: username }, function(err, docs) {
        if (err) {
          console.log(err);
        } else if (docs.length === 0) {
          myUser.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              util.createSession(req, res, myUser);
            }
          });
        } else {
        console.log('Account already exists');
        res.redirect('/signup');
        }
      });
    }
  });
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function(err, links) {
    if (links.length < 1) {
      res.redirect('/');
    } else {
      Link.update({ code: req.params[0] }, { $set: { visits: links[0].visits + 1 } }, function(err, raw) {
        if (err) {
          console.log(err);
        }
        return res.redirect(links[0].url);
      });
    }
  });
};