'use strict';

const utils = require('../utils/writer.js'),
      Address = require('../service/AddressService'),
      session = require('../utils/SessionManager');

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
    var first_name = req.swagger.params['first_name'].value;
    var last_name = req.swagger.params['last_name'].value;

    var userId = session.getUserId();

    let userData = session.getSecureParameter('userData');

    Address.userAddAddressPOST(userId,addressStreetLine1,city,zip_code,province,country,first_name,last_name,addressStreetLine2)
        .then(function (response) {
            userData.address = {
                first_name: first_name,
                last_name: last_name,
                addressStreetLine1: addressStreetLine1,
                addressStreetLine2: addressStreetLine2,
                city: city,
                zip_code: zip_code,
                province: province,
                country: country
            };
            console.log(userData);
            session.setSecureParameter('userData', userData);
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res, {message: "Internal Server Error!"}, response && response.errorCode || 500);
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
    let last_name = req.swagger.params['last_name'].value;
    let first_name = req.swagger.params['first_name'].value;

    if(!(addressStreetLine1 || addressStreetLine2 || city
         || zip_code || province || country || last_name || first_name)){
        utils.writeJson(res, {message: "No parameter provided!"}, 400);
        return;
    }

    let userId = session.getUserId();

    Address.userModifyAddressPUT(userId, first_name,last_name,addressStreetLine1,addressStreetLine2,city,zip_code,province,country)
        .then(function (response) {
            if(response.length === 0){
                console.log("Update on non existing address.");
                utils.writeJson(res,
                                {message:"User has not an address, use /user/add/address to add one"},
                                400);
                return;
            }
            let userData = session.getSecureParameter('userData');
            userData.address = {
                first_name: first_name,
                last_name: last_name,
                addressStreetLine1: addressStreetLine1,
                addressStreetLine2: addressStreetLine2,
                city: city,
                zip_code: zip_code,
                province: province,
                country: country
            };
            session.setSecureParameter('userData', userData);
            utils.writeJson(res, userData.address);
        })
        .catch(function (response) {
            console.log(response);
            utils.writeJson(res, {message: "Internal Server Error!"}, response && response.errorCode || 500);
        });
};
