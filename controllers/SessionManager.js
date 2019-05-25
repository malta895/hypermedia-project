"use strict";

let cookieSession = require('cookie-session'),
    keygrip = require('keygrip'),
    jwt = require('jsonwebtoken'),
    cookieParser = require('cookie-parser');



const tokenSecret = "CAMBIAMI!"; //TODO inventarne uno decente e metterlo in un file config nella cartella /other

let calculateToken = function(payload){
    //TODO implementare
};



exports.getSession = function(payload) {
    if(payload){
        //se c'è payload devo creare una sessione da utente loggato
        //creo un nuovo cookie da affiancare a quella da utente non loggato
        const cookieName = "authSession";
        //TODO implementare

    } else {
        //se il payload è nullo genero una sessione "non autenticata",
        //ovvero una sessione di un utente non loggato che può solo fare richieste GET
        const cookieName = "nSession";
        //TODO implementare

    }
};

exports.checkSession = function(){

};
