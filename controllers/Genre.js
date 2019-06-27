'use strict';

var utils = require('../utils/writer.js');
var Genre = require('../service/GenreService');

module.exports.genresGET = function genresGET (req, res, next) {
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Genre.genresGET(offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res,{message: "Internal Server Error!"} , 500);
        });
};
