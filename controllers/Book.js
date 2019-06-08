'use strict';

var utils = require('../utils/writer.js');
var Book = require('../service/BookService');

module.exports.bookEventsGET = function bookEventsGET (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Book.bookEventsGET(bookId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.bookReviewsGET = function bookReviewsGET (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Book.bookReviewsGET(bookId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.booksGET = function booksGET (req, res, next) {
    var title = req.swagger.params['title'].value;
    var not_in_stock = req.swagger.params['not_in_stock'].value;
    var publishers = req.swagger.params['publishers'].value;
    var authors = req.swagger.params['authors'].value;
    var iSBN = req.swagger.params['ISBN'].value;
    var min_price = req.swagger.params['min_price'].value;
    var max_price = req.swagger.params['max_price'].value;
    var genre = req.swagger.params['genre'].value;
    var themes = req.swagger.params['themes'].value;
    var best_seller = req.swagger.params['best_seller'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;

    //TODO IMPLEMENTARE
    Book.booksGET(title,not_in_stock,publishers,authors,iSBN,min_price,max_price,genre,themes,best_seller,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, 500);
        });
};

module.exports.getBookById = function getBookById (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    Book.getBookById(bookId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            let statusCode;
            if(response.notFound)
                statusCode = 404;
            else
                statusCode = 500;
            utils.writeJson(res, response, statusCode);
        });
};

module.exports.relatedBooksGET = function relatedBooksGET (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Book.relatedBooksGET(bookId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            if(response.notFound)
                statusCode = 404;
            else
                statusCode = 500;
            utils.writeJson(res, response, statusCode);
        });
};


