'use strict';

var utils = require('../utils/writer.js');
var Editor = require('../service/EditorService');

module.exports.publisherIdGET = function publisherIdGET (req, res, next) {
  var publisherId = req.swagger.params['publisherId'].value;
  Editor.publisherIdGET(publisherId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
