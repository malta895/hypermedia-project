'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');
var session = require('../utils/SessionManager.js');

module.exports.userDeletePOST = function userDeletePOST (req, res, next) {
    try{
        let userId = session.getUserId();

        User.userDeletePOST()
            .then(function (response) {
                utils.writeJson(res, {message: "Succesful operation!"});
            })
            .catch(function (response) {
                utils.writeJson(res, {message: "Errors performing the operation!"}, 500);
            });
    } catch (e){
        utils.writeJson(res, {error: "You were not logged in!"}, 400);
    }

};

module.exports.userLoginPOST = function userLoginPOST (req, res, next) {

    //se l'utente è già loggato non può fare il login nuovamente
    //fermo tutto con return: la chiamata al db non è necessaria
    if(session.userIdExists()){
        utils.writeJson(res, {error: "Already logged in!"}, 400);
        console.log(session.getUserId());
        return;
    }

    var username = req.swagger.params['username'].value;
    var password = req.swagger.params['password'].value;

    User.userLoginPOST(username,password)
        .then(function (response) {
            try{
                session.setUserId(response.user_id);
                //console.log(sessiongetUserId());
                console.log(session.getSession().userId);
                utils.writeJson(res, response);
            }catch(e){//non dovrebbe mai capitare
                utils.writeJson(res, {message: "Already logged in!"}, 400);
            }
        })
        .catch(function (response) {
            utils.writeJspon(res, {message: response.message}, response.code);
        });
};

module.exports.userLogoutPOST = function userLogoutPOST (req, res, next) {
    try{
        session.unsetUserId();
        utils.writeJson(res, {message:"Succesful logout!"});
    } catch(e){
        utils.writeJson(res, {message: "You were not logged in!"}, 400);
    }


    //non è necessario chiamare il db (o forse sì per loggare?)
    // User.userLogoutPOST()
    //     .then(function (response) {
    //         utils.writeJson(res, response);
    //     })
    //     .catch(function (response) {
    //         utils.writeJson(res, response);
    //     });
};

module.exports.userModifyPUT = function userModifyPUT (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You were not logged in!"}, 403);
        return;
    }

    var body = req.swagger.params['body'].value;

    User.userModifyPUT(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, {message: response.message}, response.code);
        });
};

module.exports.userRegisterPOST = function userRegisterPOST (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You were not logged in!"}, 403);
        return;
    }


    var body = req.swagger.params['body'].value;
    User.userRegisterPOST(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, {message: response.message}, response.code);
        });
};
