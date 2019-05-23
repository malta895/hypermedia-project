'use strict';

var utils = require('../utils/writer.js');
var Book = require('../service/BookService');

module.exports.booksGET = function booksGET (req, res, next) {
  var title = req.swagger.params['title'].value;
  var not_in_stock = req.swagger.params['not_in_stock'].value;
  var publishers = req.swagger.params['publishers'].value;
  var authors = req.swagger.params['authors'].value;
  var min_price = req.swagger.params['min_price'].value;
  var max_price = req.swagger.params['max_price'].value;
  var genre = req.swagger.params['genre'].value;
  var themes = req.swagger.params['themes'].value;
  var best_seller = req.swagger.params['best_seller'].value;
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Book.booksGET(title,not_in_stock,publishers,authors,min_price,max_price,genre,themes,best_seller,offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBookById = function getBookById (req, res, next) {
  var bookId = req.swagger.params['bookId'].value;
  Book.getBookById(bookId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.similarBooksGET = function similarBooksGET (req, res, next) {
  var bookId = req.swagger.params['bookId'].value;
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Book.similarBooksGET(bookId,offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
