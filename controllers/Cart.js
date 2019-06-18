'use strict';

var utils = require('../utils/writer.js');
var Cart = require('../service/CartService');
var session = require('../utils/SessionManager');


module.exports.cartGET = function cartGET (req, res, next) {
    var limit = req.swagger.params['limit'].value;
    var offset = req.swagger.params['offset'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Cart.cartGET(userId, limit, offset)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode || 500);
        });

};

module.exports.cartRemoveDELETE = function cartRemoveDELETE (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Cart.cartRemoveDELETE(userId, bookId,quantity)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode || 500);
        });
};

module.exports.cartUpdatePUT = function cartUpdatePUT (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    Cart.cartUpdatePUT(userId, bookId,quantity)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.log(response);
            utils.writeJson(res, response, response.errorCode || 500);
        });
};
