'use strict';

var utils = require('../utils/writer.js');
var Cart = require('../service/CartService');

module.exports.cartGET = function cartGET (req, res, next) {
    var offset = req.swagger.params['offset'].value;

    //TODO se la sessione è valida, recupero userId e chiamo il service
    //TODO IMPLEMENTARE
    if(false){
        var userId = 1;
        Cart.cartGET(userId, offset)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                utils.writeJson(res, response);
            });
    } else {
        let response = {message: "Not authorized!"};
        utils.writeJson(res, response, 403);
    }


};

module.exports.cartRemoveDELETE = function cartRemoveDELETE (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    //TODO IMPLEMENTARE
    Cart.cartRemoveDELETE(bookId,quantity)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.cartUpdatePUT = function cartUpdatePUT (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    //TODO IMPLEMENTARE
    Cart.cartUpdatePUT(bookId,quantity)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
