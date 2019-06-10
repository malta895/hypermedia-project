'use strict';

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');


//TODO IMPLEMENTARE TUTTO

module.exports.orderAddressGET = function orderAddressGET (req, res, next) {
  var orderId = req.swagger.params['orderId'].value;
  Order.orderAddressGET(orderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.orderDetailsGET = function orderDetailsGET (req, res, next) {
    var orderId = req.swagger.params['orderId'].value;
    Order.orderDetailsGET(orderId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.orderPlacePOST = function orderPlacePOST (req, res, next) {
  var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
  var city = req.swagger.params['city'].value;
  var zip_code = req.swagger.params['zip_code'].value;
  var province = req.swagger.params['province'].value;
  var country = req.swagger.params['country'].value;
  var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;
  Order.orderPlacePOST(addressStreetLine1,city,zip_code,province,country,addressStreetLine2)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.ordersGET = function ordersGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Order.ordersGET(offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
