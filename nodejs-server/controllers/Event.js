'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

module.exports.eventGET = function eventGET (req, res, next) {
  var nameLike = req.swagger.params['nameLike'].value;
  var dateMin = req.swagger.params['dateMin'].value;
  var dateMax = req.swagger.params['dateMax'].value;
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Event.eventGET(nameLike,dateMin,dateMax,offset,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.eventIdGET = function eventIdGET (req, res, next) {
  var eventId = req.swagger.params['eventId'].value;
  Event.eventIdGET(eventId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
