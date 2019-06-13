'use strict';

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');
var session = require('../utils/SessionManager');


//TODO IMPLEMENTARE TUTTO

module.exports.orderAddressGET = function orderAddressGET (req, res, next) {
    var orderId = req.swagger.params['orderId'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Order.orderAddressGET(orderId, userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.orderDetailsGET = function orderDetailsGET (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();


    var orderId = req.swagger.params['orderId'].value;


    Order.orderDetailsGET(orderId, userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode || 500);
        });
};

module.exports.orderPlacePOST = function orderPlacePOST (req, res, next) {
    var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
    var city = req.swagger.params['city'].value;
    var zip_code = req.swagger.params['zip_code'].value;
    var province = req.swagger.params['province'].value;
    var country = req.swagger.params['country'].value;
    var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;


    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Order.orderPlacePOST(userId, addressStreetLine1,city,zip_code,province,country,addressStreetLine2)
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
