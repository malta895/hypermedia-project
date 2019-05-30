'use strict';

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');

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
