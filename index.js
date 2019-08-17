'use strict';
const dotenv = require('dotenv');

if (!process.env.HEROKU_ENV)
  dotenv.config(); // in locale uso un file .env, recupero eventuali variabili d'ambiente in quel file

//verifica environment
if (!process.env.PORT) {
  console.error("\n\nERROR: No port specified! Verify that environment variable PORT exists!\n\n");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("\n\nERROR: Can't find DATABASE_URL environment variable!\n\n");
  process.exit(1);
}

if (!process.env.TOKEN_SECRET) {
  console.error("\n\nERROR: Can't find TOKEN_SECRET environment variable! Application would be insecure!\n\n");
  process.exit(1);
}

const fs = require('fs'),
      path = require('path'),
      http = require('http'),
      utils = require('./utils/writer.js');

const express = require('express'),
      app = express(),
      swaggerTools = require('swagger-tools'),
      jsyaml = require('js-yaml'),
      serverPort = process.env.PORT;

let {
  createSession
} = require("./utils/SessionManager");

let {
  setupDataLayer
} = require("./service/DataLayer");

let {
  downloadRepoZip
} = require('./utils/zipDownloader');


// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

//Salvo il file zip della repo e lo rendo disponibile staticamente
if (process.env.SERVEZIP && process.env.GITHUB_TOKEN && process.env.GITHUB_URL) {
  downloadRepoZip()
    .then(() => {
      console.info('Repo Zip saved! Serving it on /backend/app.zip');
    })
    .catch(err => console.error(err));
} else {
  console.log("The zip of the repo will not be downloaded");
}
// app.use('/backend/app.zip', express.static('app.zip'));

app.set('trust proxy', 1); //così i cookie passano attraverso il proxy


//Manage the session
app.use(createSession());
app.use(function(req, res, next) {
  if (req.session[req.sessionID] === undefined) {
    req.session[req.sessionID] = {};
  }
  next();
});

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {

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

  //Serve statically the api specs and the documentation
  // app.use('/backend', express.static(path.join(__dirname, "./other/backend")));



  //==============================================
  //Handle 404 errors. Leave this as last app.use()
  app.use(function(req, res, next) {
    console.log('404 error on ' + req.url);
    res.status(404);

    if (req.url.startsWith('/api')) {
      utils.writeJson(res, {
        message: "API endpoint not found!"
      }, 404);
    } else if (req.accepts('text/html')) {
      req.url = '/pages/404.html';
      app.handle(req, res);
    } else {
      res.send('404 Not Found');
    }

  });

  setupDataLayer(process.env.DATABASE_URL)
    .then(() => {
      // Start the server
      http.createServer(app).listen(serverPort, function() {
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
      console.error(err);
      console.error("Impossibile connettersi al db. L'applicazione sarà chiusa");
    });
});
