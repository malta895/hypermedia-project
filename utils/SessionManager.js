"use strict";

let session = require('express-session');
let crypto = require('crypto');
let uuid = require('uuid/v4');
let FileStore = require('session-file-store')(session);

const tokenSecret = process.env.TOKEN_SECRET;

var currSession;



exports.createSession = function(req, res, next) {

    if(currSession){
        console.log("Warning: session already exists!");
        return currSession;
    }

    //se non siamo su heroku il cookie non è settato come secure
    //infatti per essere secure bisogna essere in https, in localhost siamo http
    //ho settato la variabile HEROKU_ENV sulla platform heroku
    let isSecure = process.env.HEROKU_ENV ? true : false;
    if(isSecure)
        console.log("Cookie served as HTTP-Only");
    else
        console.log("WARNING: Cookie will not be secure, we're serving on HTTP!");


    if(!tokenSecret)
        console.log("WARNING: tokenSecret is undefined! Ensure the env variable TOKEN_SECRET is set!");

    let buffer=Buffer.alloc(256);
    let rand = crypto.randomFillSync(buffer,0,256).toString('hex');

    currSession = session({
        genid: (req) => {
            return uuid();
        },
        store: new FileStore(),
        name: "session_id",
        secret: tokenSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: isSecure },
        maxAge: 5*60*60*1000
    });

    return currSession;

};


exports.getUserId = function(req){
    let sid = req.sessionID;
    if(currSession[req.sessionID] === undefined){
        currSession[req.sessionID] = {};
    }
    let userId = currSession[sid].userId;
        if(userId){
            return userId;
        }else{
            throw new Error("No userId in session!");
        }

};

exports.userIdExists = function(req) {
    let sid = req.sessionID;
    console.log('VERIFY ' + sid);
    if(currSession[req.sessionID] === undefined){
        currSession[req.sessionID] = {};
    }
    return currSession[sid].userId !== undefined ? true : false;
};

exports.unsetUserId = function(req){
    let sid = req.sessionID;
    if(currSession[sid].userId !== undefined){
        delete currSession[sid].secureParameters;
        delete currSession[sid].userId;
    } else {
        throw new Error("No userId in session!");
    }
};


exports.setUserId = function(req,userId){
    let sid = req.sessionID;
    if(exports.userIdExists(req)){//should never happen, due to bugs in controller
        console.log("ERRORE IN setUserId");
        throw new Error("userId already in session");
    } else {
        currSession[sid].userId = userId;
        console.log("UserId settato a " + userId);
        currSession[sid].secureParameters = {};//parametri che sono associati al login dell'utente, da distruggere al logout
    }

};

/**
* Set a parameter for the current session.
* If isSecure is true, the parameter is destroyed at logout
*
**/
exports.setParameter = function(req,key, value, isSecure) {
    let sid = req.sessionID;
    if(key === "userId")
        throw new Error("Cannot set user id with this method! Use setUserId() instead");

    if(currSession[sid] === undefined)
        currSession[sid] = {};

    if(isSecure)
        currSession[sid].secureParameters[key] = value;
    else
        currSession[sid][key] = value;
};

exports.setSecureParameter = function(req,key, value) {
    exports.setParameter(key, value, true);
};

exports.unsetParameter = function(req,key, isSecure) {
    let sid = req.sessionID;
    if(key === "userId")
        throw new Error("Cannot unset user id with this method! Use unsetUserId(req) instead");

    if(isSecure)
        delete currSession[sid].secureParameters[key];
    else
        delete currSession[sid][key];

};

exports.unsetSecureParameter = function(req,key, value) {
    exports.unsetParameter(req,key, value, true);
};

exports.getParameter = function (req,key, isSecure) {
    let sid = req.sessionID;
    if(isSecure)
        return currSession[sid].secureParameters[key];
    return currSession[sid][key];
};

exports.getSecureParameter = function(req,key) {
    let sid = req.sessionID;
    return exports.getParameter(req,key, true);
};
