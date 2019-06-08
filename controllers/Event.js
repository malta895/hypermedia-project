'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

module.exports.bookEventsGET = function bookEventsGET (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;

    //TODO IMPLEMENTARE
    Event.bookEventsGET(bookId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.eventGET = function eventGET (req, res, next) {
  var offset = req.swagger.params['offset'].value;
  var limit = req.swagger.params['limit'].value;
  Event.eventGET(offset,limit)
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
     });;
};

module.exports.eventIdGET = function eventIdGET (req, res, next) {
  var eventId = req.swagger.params['eventId'].value;
  Event.eventIdGET(eventId)
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
