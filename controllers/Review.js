'use strict';

var utils = require('../utils/writer.js');
var Review = require('../service/ReviewService');
var sanitizeHtml = require('sanitize-html');

//TODO IMPLEMENTARE TUTTO

module.exports.bookAddReviewPOST = function bookAddReviewPOST (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var rating = req.swagger.params['rating'].value;
    var title = req.swagger.params['title'].value;
    var text = req.swagger.params['text'].value;
    Review.bookAddReviewPOST(bookId,rating,title,text)
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
  Review.bookReviewsGET(bookId,offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.reviewIdGET = function reviewIdGET (req, res, next) {
  var reviewId = req.swagger.params['reviewId'].value;
  Review.reviewIdGET(reviewId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
      .catch(function (response) {
          let statusCode;
          if (response.notFound)
              statusCode = 404;
          else
              statusCode = 500;
          utils.writeJson(res, response, statusCode);
      });
};

module.exports.userReviewsGET = function userReviewsGET (req, res, next) {
    var userId = req.swagger.params['userId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Review.userReviewsGET(userId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
