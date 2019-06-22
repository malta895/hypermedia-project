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


    var userId = session.getUserId();

    //se nome e cognome sono in sessione li aggiungo, onde evitare inutili subquery
    let firstName, lastName;
    let userData = session.getSecureParameter('userData');
    if(userData){
        firstName = userData.first_name;
        lastName = userData.surname;
    }

    Address.userAddAddressPOST(userId,addressStreetLine1,city,zip_code,province,country,firstName,lastName,addressStreetLine2)
        .then(function (response) {
            let userData = session.getSecureParameter('userData');
            userData.address = response;
            session.setSecureParameter('userData', userData);
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
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

    //se nome e cognome sono in sessione li aggiungo, onde evitare inutili subquery
    let firstName, lastName;
    let userData = session.getSecureParameter('userData');
    if(userData){
        firstName = userData.first_name;
        lastName = userData.surname;
    }

    Address.userModifyAddressPUT(userId, firstName,lastName,addressStreetLine1,addressStreetLine2,city,zip_code,province,country)
        .then(function (response) {
            if(response.length === 0){
                console.log("Update on non existing address.");
                utils.writeJson(res,
                                {message:"User has not an address, use /user/add/address to add one"},
                                400);
                return;
            }
            let userData = session.getSecureParameter('userData');
            userData.address = response[0];
            session.setSecureParameter('userData', userData);
            utils.writeJson(res, response[0]);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response && response.errorCode || 500);
        });
};
