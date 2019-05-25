'use strict';

var utils = require('../utils/writer.js');
var Author = require('../service/AuthorService');

module.exports.authorIdGET = function authorIdGET (req, res, next) {
  var authorId = req.swagger.params['authorId'].value;
  Author.authorIdGET(authorId)
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

module.exports.authorsGET = function authorsGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Author.authorsGET(offset,limit)
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
