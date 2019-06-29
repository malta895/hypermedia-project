'use strict';

const utils = require('../utils/writer.js'),
      Order = require('../service/OrderService'),
      session = require('../utils/SessionManager');

module.exports.orderPlacePOST = function orderPlacePOST (req, res, next) {
    var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
    var city = req.swagger.params['city'].value;
    var zip_code = req.swagger.params['zip_code'].value;
    var province = req.swagger.params['province'].value;
    var country = req.swagger.params['country'].value;
    var shipping_method = req.swagger.params['shipping_method'].value;
    var payment_method = req.swagger.params['payment_method'].value;
    var first_name = req.swagger.params['first_name'].value;
    var last_name = req.swagger.params['last_name'].value;
    var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Order.orderPlacePOST(userId,addressStreetLine1,city,zip_code,province,country,shipping_method,payment_method,first_name,last_name,addressStreetLine2)
        .then(function (response) {
            console.log(response);
            utils.writeJson(res,
                            {orderId: response[0]});
        })
        .catch(function (response) {
            console.error(response);
            if(response.errorCode === 404)
                utils.writeJson(res, {message: "Cart is empty!"}, 404);
            else
                utils.writeJson(res,
                            {message: "Internal Server Error!"},
                            response.errorCode || 500);
        });
};

module.exports.ordersGET = function ordersGET (req, res, next) {
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Order.ordersGET(userId,offset,limit)
        .then(function (response) {
            if(response.length)
                utils.writeJson(res, response);
            else
                utils.writeJson(res,
                                {message: "No orders found!"},
                                404);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
