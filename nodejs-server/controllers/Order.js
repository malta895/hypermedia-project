'use strict';

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');

module.exports.orderPlacePOST = function orderPlacePOST (req, res, next) {
  Order.orderPlacePOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
