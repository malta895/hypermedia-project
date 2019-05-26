"use strict";

let session = require('express-session');

const tokenSecret = "5232e0a776bf44460f2829871466563038152ece44d46ae60f59042163386c750780e4272d697cb9"; //TODO inventarne uno decente e metterlo in un file config nella cartella /other

let calculateToken = function(payload){
    //TODO implementare (serve?)
};

var currSession;



exports.getSession = function(req, res, next) {

    if(currSession)
        return currSession;

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
    return currSession.userId !== undefined;
};

exports.unsetUserId = function(){
    if(currSession.userId !== undefined){
        delete currSession.userId;
    } else {
        throw new Error("No userId in session!");
    }
};


exports.setUserId = function(userId){
    if(currSession.userId !== undefined){//should never happen, due to bugs in controller
        throw new Error("userId already in session");
    } else {
        currSession.userId = userId;
    }

};

