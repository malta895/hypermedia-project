'use strict';

var utils = require('../utils/writer.js');
var Address = require('../service/AddressService');
var session = require('../utils/SessionManager');

module.exports.userAddAddressPOST = function userAddAddressPOST (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
    var city = req.swagger.params['city'].value;
    var zip_code = req.swagger.params['zip_code'].value;
    var province = req.swagger.params['province'].value;
    var country = req.swagger.params['country'].value;
    var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;


    var userId = session.getUserId();

    Address.userAddAddressPOST(userId, addressStreetLine1,city,zip_code,province,country,addressStreetLine2)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response && response.errorCode || 500);
        });
};

module.exports.userModifyAddressPUT = function userModifyAddressPUT (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
    var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;
    var city = req.swagger.params['city'].value;
    var zip_code = req.swagger.params['zip_code'].value;
    var province = req.swagger.params['province'].value;
    var country = req.swagger.params['country'].value;

    if(!(addressStreetLine1 || addressStreetLine2 || city
         || zip_code || province || country)){
        utils.writeJson(res, {message: "No parameter provided!"}, 400);
        return;
    }

    let userId = session.getUserId();

    Address.userModifyAddressPUT(userId, addressStreetLine1,addressStreetLine2,city,zip_code,province,country)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response && response.errorCode || 500);
        });
};
