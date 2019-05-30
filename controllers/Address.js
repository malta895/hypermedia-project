'use strict';

var utils = require('../utils/writer.js');
var Address = require('../service/AddressService');

module.exports.userAddAddressPOST = function userAddAddressPOST (req, res, next) {
  var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
  var city = req.swagger.params['city'].value;
  var zip_code = req.swagger.params['zip_code'].value;
  var province = req.swagger.params['province'].value;
  var country = req.swagger.params['country'].value;
  var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;
  Address.userAddAddressPOST(addressStreetLine1,city,zip_code,province,country,addressStreetLine2)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userModifyAddressPOST = function userModifyAddressPOST (req, res, next) {
  var addressStreetLine1 = req.swagger.params['addressStreetLine1'].value;
  var city = req.swagger.params['city'].value;
  var zip_code = req.swagger.params['zip_code'].value;
  var province = req.swagger.params['province'].value;
  var country = req.swagger.params['country'].value;
  var addressStreetLine2 = req.swagger.params['addressStreetLine2'].value;
  Address.userModifyAddressPOST(addressStreetLine1,city,zip_code,province,country,addressStreetLine2)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
