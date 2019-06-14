'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    dotenv = require('dotenv');

dotenv.config(); // salvo variabili d'ambiente nel file .env

var express = require('express');
var app = express();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 8080;

let { createSession } = require("./utils/SessionManager");

let { setupDataLayer } = require("./service/DataLayer");


// swaggerRouter configuration
var options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

//Session manager
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



    setupDataLayer(process.env.DATABASE_URL)
        .then(() => {
            // Start the server
            http.createServer(app).listen(serverPort, function () {
                console.log('\n');
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                console.log('\n');
                console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
                console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
                console.log('Homepage is available at http://localhost:%d/', serverPort);
                console.log('Api specifications in YAML format are available at http://localhost:%d/backend/spec.yaml', serverPort);
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
