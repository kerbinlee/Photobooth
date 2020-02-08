var domain = "https://maythird.ddns.net"
var portNumber = 8080;
// Google Cloud Vision API key
var gcvKey = "AIzaSyBQ0FVNWYwXYNDXTLInrPQTMKtYgqyMqTA";
// Google Cloud Vision API URL
var gcvurl = 'https://vision.googleapis.com/v1/images:annotate?key='+gcvKey;

var sendrequest = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// read in SSL certificate files
//var fs = require('fs');
//var https = require('https');
//var privateKey  = fs.readFileSync('/etc/letsencrypt/live/maythird.ddns.net/privkey.pem', 'utf8');
//var certificate = fs.readFileSync('/etc/letsencrypt/live/maythird.ddns.net/cert.pem', 'utf8');
//var ca = fs.readFileSync('/etc/letsencrypt/live/maythird.ddns.net/chain.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate, ca: ca};

function errorCallback(err) {
    if (err) {
        console.log("error: ",err,"\n");
    }
}

function dataCallback(err, tableData) {
    if (err) {
        console.log("error: ",err,"\n");
    } else {
        console.log("got: ",tableData,"\n");
    }
}

var express = require('express');
// for uploading images in forms
var formidable = require('formidable');

// make a new express server object
var app = express();

// enable logging
var morgan  = require('morgan');
app.use(morgan('combined'));

// get cookie for session; creates cookie and database if needed
app.use(require('./cookies'));

// use SQLite3
var sqlite3 = require("sqlite3").verbose();

// function to get SQLite database instance based on session id
function getDb(sid) {
    var dbFile = sid + ".db"
    var db = new sqlite3.Database(dbFile);  // new object, uses existing database
    return db;
}

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public directory
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
app.get('/query', function (request, response) {
    // get database based on session id from cookie
    var db = getDb(request.cookies.sid);
    query = request.url.split("?"); // split query string
    // if query exists
    if (query[1]) {
        if (query[1] == "load_images") {
            // return array of data from database in response object
            db.all('SELECT * FROM photoLabels', function(err, tableData) {
                if (err) {
                    errorCallback(err);
                } else {
                    response.status(200);
                    response.type("text/json");
                    response.send(tableData);
                }
            });
        } else if (query[1] == "tag_search") {
            // return array of data from database in response object
            db.all('SELECT * FROM photoLabels WHERE labels LIKE ?',["%"+query[2]+"%"], function(err, tableData) {
                if (err) {
                    errorCallback(err);
                } else {
                    response.status(200);
                    response.type("text/json");
                    response.send(tableData);
                }
            });
        } else if (query[1] == "load_fav") {
            db.all('SELECT * FROM PhotoLabels WHERE favorite = 1', function(err, tableData) {
                if (err) {
                    errorCallback(err);
                } else {
                    response.status(200);
                    response.type("text/json");
                    response.send(tableData);
                }
            });
        }
    } else {
        sendCode(400,response,'query not recognized');
    }
});

// Case 3: upload images
// Responds to any POST request
app.post('/query', function (request, response) {
    // get database based on session id from cookie
    var db = getDb(request.cookies.sid);
    query = request.url.split("?"); // split query string
    // if query exists
    if (query[1]) {
        // image upload
        if (query[1] == "load_image") {
            var form = new formidable.IncomingForm(); // Here comes form FormData, on the otherend of Upload.
            form.parse(request); // figures out what files are in form
            // callback for when a file begins to be processed
            var filename;
            var fileName_encoded;
            form.on('fileBegin', function (name, file) {
                filename = file.name;
                console.log("filename is: "+ filename);
                // put it in /public
                file.path = __dirname + '/public/' + file.name;

                // add image to database
                fileName_encoded = encodeURI(file.name); // replaces spaces with %20, etc.
                db.run('INSERT OR REPLACE INTO photoLabels VALUES ("'+fileName_encoded+'", "", 0)',
                    errorCallback);
            });

            // callback for when file is fully recieved
            form.on('end', function () {
                console.log('upload success');

                // get image labels from Google Cloud Vision
                if (query[2] == "1") {
                    // The code that makes a request to the API
                    // Uses the Node request module, which packs up and sends off
                    // an XMLHttpRequest.
                    sendrequest(
                        { // HTTP header stuff
                            url: gcvurl,
                            method: "POST",
                            headers: {"content-type": "application/json"},
                            // stringifies object and puts into HTTP request body as JSON
                            json:
                            {
                                "requests":
                                [
                                    {
                                        "image":
                                        {
                                            "source":
                                            {
                                                "imageUri": domain+':'+portNumber+'/'+fileName_encoded
                                            }
                                        },
                                        "features":
                                        [
                                            {
                                                "type": "LABEL_DETECTION"
                                            }
                                        ]
                                    }
                                ]
                            },
                        },
                        // callback function for API request
                        function (err, APIresponse, body) {
                            if ((err) || (APIresponse.statusCode != 200)) {
                                console.log("Got API error");
                            } else {
                                var gcvlabels = "";
                                APIresponseJSON = body.responses[0].labelAnnotations;
                                for (var i = 0; i < APIresponseJSON.length; i++) {
                                    console.log(APIresponseJSON[i].description);
                                    if (gcvlabels == "") {
                                        gcvlabels = APIresponseJSON[i].description;
                                    } else {
                                        gcvlabels = gcvlabels+','+APIresponseJSON[i].description;
                                    }
                                }
                                console.log("Received labels " + gcvlabels);

                                db.run('UPDATE photoLabels SET labels = ? WHERE fileName = ?', [gcvlabels, fileName_encoded], errorCallback);
                                sendCode(200,response,'recieved file');  // respond to browser
                            }
                        }

                    );
                } else {  // not live! return fake response
                    console.log("not live");
                    db.run('UPDATE photoLabels SET labels = "" WHERE fileName = ?',
                        [fileName_encoded], errorCallback);
                    sendCode(201,response,'recieved file'); // respond to browser
                }
            });
        } else if (query[1] == "delete_tag") {
            // query[2] is filename
            // query[3] is labels
            db.run('UPDATE photoLabels SET labels = ? WHERE fileName = ? ',
                [query[3], query[2]], function(err) {
                if (err) {
                    errorCallback(err);
                } else {
                    response.status(201);
                    response.type("text/json");
                    response.send("deleted label from labels");
                }
            });
        } else if (query[1] == "add_label") {
            // query[2] is filename
            // query[3] is labels
            db.run('UPDATE photoLabels SET labels = ? WHERE fileName = ? ',
                [query[3], query[2]], function(err) {
                if (err) {
                    errorCallback(err);
                } else {
                    response.status(201);
                    response.type("text/json");
                    response.send("added label to labels");
                }
            });
        } else if (query[1] == "mark_favorite") {
            db.run('UPDATE photoLabels SET favorite = ? WHERE fileName = ? ',
                [query[3], query[2]], function(err) {
                if (err) {
                    errorCallback(err);
                } else {
                    response.status(201);
                    response.type("text/json");
                    response.send("marked favorite");
                }
            });
        }
    } else {
        sendCode(400,response,'query not recognized');
    }
});

// create https server and listen to speicified port number
//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(portNumber);

// tell express to listen to correct port number
app.listen(portNumber, "0.0.0.0");

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}
