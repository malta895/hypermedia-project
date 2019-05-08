'use strict';

var utils = require('../utils/writer.js');
var Publisher = require('../service/PublisherService');

module.exports.publisherIdGET = function publisherIdGET (req, res, next) {
  var publisherId = req.swagger.params['publisherId'].value;
  Publisher.publisherIdGET(publisherId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
