'use strict';

var utils = require('../utils/writer.js');
var Review = require('../service/ReviewService');
var sanitizeHtml = require('sanitize-html'),
    session = require('../utils/SessionManager');

const removeHtml = function(dirty) {
    return sanitizeHtml(dirty, {
        allowedTags: [],
        allowedAttributes: []
    });
};

const allowMinimalHtml = function(dirty)  {
    return sanitizeHtml(dirty, {
        allowedTags: ['b', 'i', 'em', 'strong'],
        allowedAttributes: []
    });
};

module.exports.bookAddReviewPOST = function bookAddReviewPOST (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var rating = req.swagger.params['rating'].value;
    var title = req.swagger.params['title'].value;
    var text = req.swagger.params['text'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    if(title)
        title = removeHtml(title);

    if(text)
        text = allowMinimalHtml(text);

    Review.bookAddReviewPOST(userId, bookId,rating,title,text)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode || 500);
        });
};


module.exports.bookReviewsGET = function bookReviewsGET (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Review.bookReviewsGET(bookId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response, response.length ? 200 : 404);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode || 500);
        });
};

module.exports.reviewIdGET = function reviewIdGET (req, res, next) {
    var reviewId = req.swagger.params['reviewId'].value;
    Review.reviewIdGET(reviewId)
        .then(function (response) {
            utils.writeJson(res, response, response.length ? 200 : 404);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.statusCode || 500);
        });
};

module.exports.userReviewsGET = function userReviewsGET (req, res, next) {
    var userId = req.swagger.params['userId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Review.userReviewsGET(userId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response, response.length ? 200 : 404);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode || 500);
        });
};
