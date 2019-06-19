'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    dotenv = require('dotenv');

dotenv.config(); // recupero le variabili d'ambiente

var utils = require('./utils/writer.js');

var express = require('express');
var app = express();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 8080;

let { createSession } = require("./utils/SessionManager");

let { setupDataLayer } = require("./service/DataLayer");

let { downloadRepoZip } = require('./utils/zipDownloader');


// swaggerRouter configuration
const options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

//Salvo il file zip della repo e lo rendo disponibile staticamente
if(!process.env.NOZIP){
    downloadRepoZip()
        .then(() =>{
            console.info('Repo Zip saved! Serving it on /backend/app.zip');
            app.use('/backend/app.zip', express.static('app.zip'));
        })
        .catch(err => console.error(err));
} else {
    console.log("The zip of the repo will not be downloaded");
}


//Manage the session
app.use(createSession());


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger II
    app.use(middleware.swaggerUi());

    //Serve the static web pages
    app.use(express.static(path.join(__dirname, "./public")));

    //Serve statically the api specs
    app.use('/backend/spec.yaml', express.static(path.join(__dirname, "./other/backend/spec.yaml")));



    //==============================================
    //Handle 404 errors. Leave this as last app.use()
    app.use(function(req, res, next) {
        console.log('404 error on ' + req.url);
        res.status(404);

        if(req.url.startsWith('/api')){
            utils.writeJson(res, {message: "API endpoint not found!"}, 404);
        } else if(req.accepts('text/html')) {
            req.url = '/pages/404.html';
            app.handle(req, res);
        } else {
            res.send('404 Not Found');
        }

    });

    setupDataLayer(process.env.DATABASE_URL)
        .then(() => {
            // Start the server
            http.createServer(app).listen(serverPort, function () {
                console.log('\n');
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                console.log('\n');
                console.log(' # Your server is listening on port %d (%s:%d)\n', serverPort, process.env.BASE_URL, serverPort);
                console.log(' # Swagger-ui is available at %s:%d/docs\n', process.env.BASE_URL, serverPort);
                console.log(' # Homepage is available at %s:%d/\n', process.env.BASE_URL, serverPort);
                console.log(' # Api specifications in YAML format are available at %s:%d/backend/spec.yaml', process.env.BASE_URL, serverPort);
                console.log('\n');
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                console.log('\n');
            });
        })
        .catch((err) => {
            console.log(err);
            console.error("Impossibile connettersi al db. L'applicazione sarà chiusa");
        });
});
