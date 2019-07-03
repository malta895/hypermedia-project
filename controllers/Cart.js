'use strict';

const utils = require('../utils/writer.js'),
      Cart = require('../service/CartService'),
      session = require('../utils/SessionManager');

module.exports.cartEmptyDELETE = function cartEmptyDELETE (req, res, next) {

    if(!session.userIdExists(req)){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId(req);

    Cart.cartEmptyDELETE(userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res,
                            {message: "Internal Server Error!"},
                            500);
        });
};

module.exports.cartGET = function cartGET (req, res, next) {
    var limit = req.swagger.params['limit'].value;
    var offset = req.swagger.params['offset'].value;

    if(!session.userIdExists(req)){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId(req);

    Cart.cartGET(userId, limit, offset)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res, {message: "Internal Server Error"}, response.errorCode || 500);
        });

};

module.exports.cartRemoveDELETE = function cartRemoveDELETE (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    if(!session.userIdExists(req)){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId(req);

    Cart.cartRemoveDELETE(userId, bookId,quantity)
        .then(function (response) {
            console.log(response);
            if(response.length === 0)
                utils.writeJson(res,
                                {message: "Given book wasn't in the cart!"},
                                404);
            else
                utils.writeJson(res,{message: "Books removed!"});
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res, {message: "Internal Server Error!"}, 500);
        });
};

module.exports.cartSetQuantityPUT = function cartSetQuantityPUT (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    if(!session.userIdExists(req)){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId(req);

    Cart.cartSetQuantityPUT(userId,bookId,quantity)
        .then(function (response) {
            if(response.length)
                utils.writeJson(res, response);
            else
                utils.writeJson(res, {message: "The book wasn't in the cart!"}, 404);
        })
        .catch(function (response) {
            console.error(response);
                utils.writeJson(res, {message: "Internal Server Error!"}, 500);
        });
};

module.exports.cartUpdatePUT = function cartUpdatePUT (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var quantity = req.swagger.params['quantity'].value;

    if(!session.userIdExists(req)){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId(req);

    Cart.cartUpdatePUT(userId, bookId,quantity)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.log(response);
            if(response.errorCode === 404)
                utils.writeJson(res, {message: "Book Not Found!"}, 404);
            else
                utils.writeJson(res, {message: "Internal Server Error"}, 500);
        });
};
