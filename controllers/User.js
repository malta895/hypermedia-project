'use strict';

const utils = require('../utils/writer.js');
const User = require('../service/UserService');
const session = require('../utils/SessionManager');
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');

//questa funzione rimuove qualsiasi codice html da una stringa
let removeHtml = function (dirty) {
    if(dirty === undefined)
        return undefined;
    return sanitizeHtml(dirty, {
        allowedTags: [],
        allowedAttributes: {}
    });
};


const emailValidator = require('email-validator');

module.exports.userDeletePOST = function userDeletePOST (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userId = session.getUserId();

    User.userDeletePOST(userId)
        .then(function (response) {
            session.unsetUserId();
            utils.writeJson(res, {message: "Succesful operation!"});
        })
        .catch(function (response) {
            utils.writeJson(res, response, 500);
        });
};


module.exports.userEmailAvailableGET = function userEmailAvailableGET (req, res, next) {
    var email = req.swagger.params['email'].value;

    email = removeHtml(email);

    if(!emailValidator.validate(email)){
        utils.writeJson(res,
                        {message: "Email is not valid!",
                         statusCode: 400},
                        400);
        return;

    }

    User.userEmailAvailableGET(email)
        .then(function (response) {
            if(response.length === 0)
                utils.writeJson(res, {message:"Email is available!"});
            else
                utils.writeJson(res,
                                {message: "An user already registered with this email!"},
                                409);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response && response.errorCode || 500);
        });
};

module.exports.userGetDetailsGET = function userGetDetailsGET (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    let userData = session.getSecureParameter('userData');
    if(userData) { //se i dati dell'utente sono già in sessione li recupero
        console.log("Dati utente da sessione");
        utils.writeJson(res, userData);
        return;
    }

    let userId = session.getUserId();

    User.userGetDetailsGET(userId)
        .then(function (response) {
            console.log("Dati utente da db");
            utils.writeJson(res, response);
            session.setSecureParameter('userData', response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response && response.errorCode || 500);
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
            if(response.length === 0){
                console.error("Wrong email/username");
                utils.writeJson(res,
                                {message: "Wrong combination username/email/password!"},
                                401);
            } else {

                let hashedPassword = response[0].password;

                //verifico password
                bcrypt.compare(password, hashedPassword)
                    .then(isPasswordRight => {

                        if(isPasswordRight){ //password corretta, procedo con il salvataggio dell'userId in sessione
                            let userId = response[0].user_id;

                            session.setUserId(userId);

                            // recupero i dati dell'utente e li metto in sessione;
                            User.userGetDetailsGET(userId)
                                .then(response => {
                                    session.setSecureParameter('userData', response);
                                })
                                .catch(err => {
                                    console.log("Salvataggio dati utente in sessione fallito.");
                                    console.error(err);
                                });

                            utils.writeJson(res, {userId: userId}); // restituisco userId al client
                        } else { //password errata
                            console.log(`User ${username} tried login with wrong password`);
                            utils.writeJson(res,
                                            {message: "Wrong combination username/email/password!"},
                                            401);
                        }

                    })
                    .catch( err => {
                        console.error(err);
                        utils.writeJson(res,
                                        {message: "Unknown error. Contact the developer."},
                                        500);
                    });
            }
        })
        .catch(function (response) {
            utils.writeJson(res,
                            {message: response.message},
                            response && response.errorCode || 500);
        });
};

module.exports.userLogoutPOST = function userLogoutPOST (req, res, next) {
    try{
        session.unsetUserId();
        utils.writeJson(res, {message:"Succesful logout!"});
    } catch(e){
        utils.writeJson(res, {message: "You were not logged in!"}, 400);
    }

};

module.exports.userModifyPUT = function userModifyPUT (req, res, next) {

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You were not logged in!"}, 403);
        return;
    }

    var username = req.swagger.params['username'].value;
    username = removeHtml(username);
    var email = req.swagger.params['email'].value;
    email = removeHtml(email);
    var firstName = req.swagger.params['firstName'].value;
    firstName = removeHtml(firstName);
    var surname = req.swagger.params['surname'].value;
    surname = removeHtml(surname);
    var birthDate = req.swagger.params['birthDate'].value;

    if(!(username ||
         email ||
         firstName ||
         surname ||
         birthDate)){
        utils.writeJson(res, {message: "No parameter set!"}, 400);
        return;
    }

    let userId = session.getUserId();

    User.userModifyPUT(userId,username, email,
                           firstName, surname, birthDate)
            .then(function (response) {
                let userData = session.getSecureParameter('userData');
                let currAddress = userData.address;
                let updatedUserData = {};
                updatedUserData = response[0];
                updatedUserData.address = currAddress;
                session.setSecureParameter('userData', updatedUserData);
                utils.writeJson(res, response);
            })
        .catch(function (response) {
            console.log(response);
            utils.writeJson(res,
                            {message: "Internal server Error!"},
                            response && response.errorCode || 500);
        });

};

module.exports.userModifyPasswordPUT = function userModifyPasswordPUT (req, res, next) {
    var old_password = req.swagger.params['old_password'].value;
    var new_password = req.swagger.params['new_password'].value;
    var confirm_new_password = req.swagger.params['confirm_new_password'].value;

    if(!session.userIdExists()){
        utils.writeJson(res, {message: "You must login to perform this operation!"}, 403);
        return;
    }

    //controllo che le due password fornite siano uguali
    if(new_password !== confirm_new_password){
        utils.writeJson(res,
                        {message: "The passwords do not match!"},
                        400);
        return;
    }

    //controllo che la password vecchia sia corretta
    let username = session.getSecureParameter('userData').username;
    let userId = session.getUserId();
    User.userLoginPOST(username, old_password)
        .then(response => {
            let hashedPassword = response[0].password;

            //verifico password
            bcrypt.compare(old_password, hashedPassword)
                .then(isPasswordRight => {

                    if(isPasswordRight){ //password corretta, procedo con il salvataggio dell'userId in sessione

                        bcrypt.hash(new_password, 10)
                            .then( hashedNewPassword => {

                                //modifico la password sul db
                                User.userModifyPasswordPUT(userId,hashedNewPassword)
                                    .then(function (response) {
                                        console.log("Password modificata con successo.");
                                        //SUCCESSO
                                        utils.writeJson(res, response);
                                    })
                                    .catch( err => {
                                        console.error("Error while updating password");
                                        console.error(err);
                                        utils.writeJson(res,
                                                        {message: "Internal Server Error!"},
                                                        500);
                                    });
                            })
                            .catch( err => {
                                console.error("Error while hashing the password!");
                                console.error(err);
                                utils.writeJson(res,
                                                {error: err, message: "Internal server error."},
                                                500);
                            });
                    } else {
                        //vecchia password errata
                        utils.writeJson(res,
                                        {message:"Old password is wrong!"},
                                        401);
                    }
                })
                .catch( err => {
                    utils.writeJson(res,
                                    {message: "Internal Server Error"},
                                    500);
                });
        })
        .catch(err => {
            console.error(err);
            utils.writeJson(res,
                            {message: "Internal Server Error"},
                            500);
        });
};


module.exports.userRegisterPOST = function userRegisterPOST (req, res, next) {

    var username = req.swagger.params['username'].value;
    username = removeHtml(username);
    var password = req.swagger.params['password'].value;
    var email = req.swagger.params['email'].value;
    email = removeHtml(email);
    var firstName = req.swagger.params['firstName'].value;
    firstName = removeHtml(firstName);
    var surname = req.swagger.params['surname'].value;
    surname = removeHtml(surname);
    var birthDate = req.swagger.params['birthDate'].value;

    if(session.userIdExists()){
        utils.writeJson(res, {message: "You must logout before registering!"}, 403);
        return;
    }

    if(!emailValidator.validate(email)){
        utils.writeJson(res,
                        {message: "Email is not valid!",
                         statusCode: 400});
        return;
    }

    //encrypt the password
    bcrypt.hash(password, 10)
        .then(hashedPassword => {

            User.userRegisterPOST(username, hashedPassword, email, firstName, surname, birthDate)
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
                        utils.writeJson(res, response, response && response.errorCode || 500);
                });

        })
        .catch( err => {
            console.error("Error while hashing the password!");
            console.error(err);
            utils.writeJson(res,
                            {error: err, message: "Internal server error."},
                            500);
        });
};

module.exports.userUsernameAvailableGET = function userUsernameAvailableGET (req, res, next) {
    var username = req.swagger.params['username'].value;

    username = removeHtml(username);

    User.userUsernameAvailableGET(username)
        .then(function (response) {
            if(response.length === 0)
                utils.writeJson(res, { message: "Username is available!" });
            else
                utils.writeJson(res,
                                {message: "Username is not available!"},
                                409);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response && response.errorCode || 500);
        });
};
