"use strict";

let session = require('express-session');

const tokenSecret = "5232e0a776bf44460f2829871466563038152ece44d46ae60f59042163386c750780e4272d697cb9";


var currSession;


exports.createSession = function(req, res, next) {

    if(currSession){
        console.log("Warning: session already exists!");
        return currSession;
    }

    //se non siamo su heroku il cookie non è settato come secure
    //infatti per essere secure bisogna essere in https, in localhost siamo http
    //ho settato la variabile HEROKU_ENV sulla piattaforma heroku
    let isSecure = process.env.HEROKU_ENV ? true : false;

    currSession = session({
        name: "session_id",
        secret: tokenSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: isSecure },
        maxAge: 5*60*60*1000
    });

    return currSession;

};


exports.getUserId = function(){
        let userId = currSession.userId;
        if(userId){
            return userId;
        }else{
            throw new Error("No userId in session!");
        }

};

exports.userIdExists = function() {
    return currSession.userId !== undefined ? true : false;
};

exports.unsetUserId = function(){
    if(currSession.userId !== undefined){
        delete currSession.secureParameters;
        delete currSession.userId;
    } else {
        throw new Error("No userId in session!");
    }
};


exports.setUserId = function(userId){
    if(exports.userIdExists()){//should never happen, due to bugs in controller
        console.log("ERRORE IN setUserId");
        throw new Error("userId already in session");
    } else {
        currSession.userId = userId;
        console.log("UserId settato a " + userId);
        currSession.secureParameters = {};//parametri che sono associati al login dell'utente, da distruggere al logout
    }

};

/**
* Set a parameter for the current session.
* If isSecure is true, the parameter is destroyed at loguot
*
**/
exports.setParameter = function(key, value, isSecure) {

    if(key === "userId")
        throw new Error("Cannot set user id with this method! Use setUserId() instead");

    if(isSecure)
        currSession.secureParameters[key] = value;
    else
        currSession[key] = value;
};

exports.setSecureParameter = function(key, value) {
    exports.setParameter(key, value, true);
};

exports.unsetParameter = function(key, isSecure) {
    if(key === "userId")
        throw new Error("Cannot unset user id with this method! Use unsetUserId() instead");

    if(isSecure)
        delete currSession.secureParameters[key];
    else
        delete currSession[key];

};

exports.unsetSecureParameter = function(key, value) {
    exports.unsetParameter(key, value, true);
};

exports.getParameter = function (key, isSecure) {
    if(isSecure)
        return currSession.secureParameters[key];
    return currSession[key];
};

exports.getSecureParameter = function(key) {
    return exports.getParameter(key, true);
};
