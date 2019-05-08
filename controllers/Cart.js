'use strict';

var utils = require('../utils/writer.js');
var Cart = require('../service/CartService');

module.exports.cartGET = function cartGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  Cart.cartGET(offset)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.cartRemoveDELETE = function cartRemoveDELETE (req, res, next) {
  var bookId = req.swagger.params['bookId'].value;
  var quantity = req.swagger.params['quantity'].value;
  Cart.cartRemoveDELETE(bookId,quantity)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.cartUpdatePUT = function cartUpdatePUT (req, res, next) {
  var bookId = req.swagger.params['bookId'].value;
  var quantity = req.swagger.params['quantity'].value;
  Cart.cartUpdatePUT(bookId,quantity)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
