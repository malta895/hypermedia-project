'use strict';

var utils = require('../utils/writer.js');
var Review = require('../service/ReviewService');

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
      utils.writeJson(res, response);
    });
};
