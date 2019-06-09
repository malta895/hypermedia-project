'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');
var session = require('../utils/SessionManager.js');

module.exports.userDeletePOST = function userDeletePOST (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    User.userDeletePOST(userId)
        .then(function (response) {
            //module.exports.userLogoutPOST();
            utils.writeJson(res, {message: "Succesful operation!"});
        })
        .catch(function (response) {
            utils.writeJson(res, response, 500);
        });
};


module.exports.userEmailAvailableGET = function userEmailAvailableGET (req, res, next) {
    var email = req.swagger.params['email'].value;
    User.userEmailAvailableGET(email)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode);
        });
};

module.exports.userGetDetailsGET = function userGetDetailsGET (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();




    User.userGetDetailsGET(userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
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
                utils.writeJson(res, response);
            }catch(e){//non dovrebbe mai capitare
                console.log("Si è verificato un errore: " + e);
                utils.writeJson(res, e, 500);
            }
        })
        .catch(function (response) {
            utils.writeJson(res, {message: response.message}, response.code);
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

    var username = req.swagger.params['username'].value;
    var password = req.swagger.params['password'].value;
    var email = req.swagger.params['email'].value;
    var firstName = req.swagger.params['firstName'].value;
    var surname = req.swagger.params['surname'].value;
    var birthDate = req.swagger.params['birthDate'].value;

    if(!(username &&
         password &&
         email &&
         firstName &&
         surname &&
         birthDate)){
        utils.writeJson(res, {message: "No parameter set!"}, 400);
    }

    User.userModifyPUT(username, password, email, firstName, surname, birthDate)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, {message: response.message}, response.code);
        });
};

module.exports.userRegisterPOST = function userRegisterPOST (req, res, next) {

    var username = req.swagger.params['username'].value;
    var password = req.swagger.params['password'].value;
    var email = req.swagger.params['email'].value;
    var firstName = req.swagger.params['firstName'].value;
    var surname = req.swagger.params['surname'].value;
    var birthDate = req.swagger.params['birthDate'].value;

    if(session.userIdExists()){
        utils.writeJson(res, {message: "You must logout before registering!"}, 403);
        return;
    }

    User.userRegisterPOST(username, password, email, firstName, surname, birthDate)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            let error = response.error;

            if(error && error.constraint) {
                if(error.constraint.endsWith('username_unique'))
                    utils.writeJson(res, {message: "Username already existing"}, 409);
                else if(error.constraint.endsWith('email_unique'))
                    utils.writeJson(res, {message: "Email already existing"}, 409);
            } else
                utils.writeJson(res, response, response.errorCode);
        });
};

module.exports.userUsernameAvailableGET = function userUsernameAvailableGET (req, res, next) {
    var username = req.swagger.params['username'].value;
    User.userUsernameAvailableGET(username)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.errorCode);
        });
};
