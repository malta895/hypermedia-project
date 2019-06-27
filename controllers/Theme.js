'use strict';

var utils = require('../utils/writer.js');
var Theme = require('../service/ThemeService');

module.exports.themesGET = function themesGET (req, res, next) {
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    Theme.themesGET(offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(response);
            utils.writeJson(res,{message: "Internal Server Error!"} , 500);
        });
};

