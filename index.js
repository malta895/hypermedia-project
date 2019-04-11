let path = require('path');
let http = require('http');

let serveStatic = require('serve-static');

let app = require('connect')();

const serverPort = process.env.PORT || 8080;

app.use(serveStatic(__dirname + "/public"));

http.createServer(app).listen(serverPort, function() {
    console.log(`Server listening on ${serverPort}`);
})


