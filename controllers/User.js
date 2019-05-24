'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.userDeletePOST = function userDeletePOST (req, res, next) {
  User.userDeletePOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userLoginPOST = function userLoginPOST (req, res, next) {
  var username = req.swagger.params['username'].value;
  var password = req.swagger.params['password'].value;
  User.userLoginPOST(username,password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userLogoutPOST = function userLogoutPOST (req, res, next) {
  User.userLogoutPOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userModifyPUT = function userModifyPUT (req, res, next) {
  var body = req.swagger.params['body'].value;
  User.userModifyPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userRegisterPOST = function userRegisterPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  User.userRegisterPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
