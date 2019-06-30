'use strict';

const utils = require('../utils/writer.js'),
      Event = require('../service/EventService');

module.exports.bookEventsGET = function bookEventsGET (req, res, next) {
    var bookId = req.swagger.params['bookId'].value;
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;

    Event.bookEventsGET(bookId,offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res, {message: "Internal Server Error!"}, 500);
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
            console.error(response);
            utils.writeJson(res, {message: "Internal Server Error!"}, 500);
        });
};

module.exports.eventIdGET = function eventIdGET (req, res, next) {
    var eventId = req.swagger.params['eventId'].value;
    Event.eventIdGET(eventId)
        .then(function (response) {
            if(response.length)
                utils.writeJson(res, response[0]);
            else
                utils.writeJson(res, {message: "Event Not Found!"}, 404);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res, {message: "Internal Server Error!"}, 500);
        });
};
