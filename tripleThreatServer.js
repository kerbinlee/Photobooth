// use sqlite3 for database and connect to photos.db
var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db";

// makes the object that represents the database in our code
var db = new sqlite3.Database(dbFile);

// If not, initialize it
//var cmdStr = "CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)"
//db.run(cmdStr);

// Handle request to add a label
var querystring = require('querystring'); // handy for parsing query strings

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


/* This server, unlike our previous ones, uses the express framework */
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images

// make a new express server object
var app = express();

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is "138.68.25.50:???/change?img=hula"
app.get('/change', function (request, response){
    console.log("query");
    query = request.url.split("?")[1]; // get query string
    if (query) {
	answer(query, response);
    } else {
	sendCode(400,response,'query not recognized');
    }
});

// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
    var form = new formidable.IncomingForm();
    form.parse(request); // figures out what files are in form

    // callback for when a file begins to be processed
    form.on('fileBegin', function (name, file){
	// put it in /public
	file.path = __dirname + '/public/' + file.name;
	console.log("uploading ",file.name,name);
        // add image to database
        db.run('INSERT OR REPLACE INTO PhotoLabels VALUES ("' + file.name + '", "", 0)', errorCallback);
    });

    // callback for when file is fully recieved
    form.on('end', function (name, file){
	console.log('success');
	sendCode(201,response,'recieved file');  // respond to browser
    });

});

// have express listen to correct port 
app.listen(7829);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}
    
// Stuff for dummy query answering
// We'll replace this with a real database someday! 
function answer(query, response) {
    console.log("answering");
    /*var parsedQuery = query.split("&");
    var imgName = parsedQuery[0].split("=")[1];
    var newLabel = parsedQuery[1].split("=")[1];
    var op = parsedQuery[2].split("=")[1];*/
    var queryObj = querystring.parse(query);
    if (queryObj.op == "add") {
	var newLabel = queryObj.label;
	var imageFile = queryObj.img;
	if (newLabel && imageFile) {
	    // good add query
	    // go to database! 
	    db.get(
		'SELECT labels FROM photoLabels WHERE fileName = ?',
		[imageFile], getCallback);

	    // define callback inside queries so it knows about imageFile
	    // because closure!
	    function getCallback(err,data) {
		console.log("getting labels from "+imageFile);
		if (err) {
		    console.log("error: ",err,"\n");
		} else {
		    // good response
		    console.log(data);
		    if (data.labels === '') {
			// if no labels for image, just add it to db
			console.log("No labels");
                        db.run(
                            'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
                            [newLabel, imageFile],
                            updateCallback);
		    } else {
			// existing labels exist, append to end of label string in db
		        db.run(
			    'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
			    [data.labels+", "+newLabel, imageFile],
			    updateCallback);
		    }	
		}
	    }

    if (queryObj.op == "remove") {
        var label = queryObj.label;
        var imageFile = queryObj.img;
        if (label && imageFile) {
            // good delete query
            // go to database! 
            db.get(
                'SELECT labels FROM photoLabels WHERE fileName = ?',
                [imageFile], getCallback);

            // define callback inside queries so it knows about imageFile
            // because closure!
            function getCallback(err,data) {
                console.log("deleting labels from "+imageFile);
                if (err) {
                    console.log("error: ",err,"\n");
                } else {
			var splitLabels = data.labels.split(", ");
			var newLabelString = "";
			// iterate through each existing label
			var i;
			for (i = 0; i < splitLabels.length; i++) {
				// if not the label to remove
				if (splitLabels[i] != label) {
					// keep label in database string
					if (newLabelString === "") {
						// if nothing in the new label string
						// just add it in
						newLabelString = splitLabels[i];
					} else {
						// labels already in newLabelString, need commas
						newLabelString = newLabelString + ", " + splitLabels[i];
					}
				}
			}
		}
	    }

	    // Also define this inside queries so it knows about
	    // response object
	    function updateCallback(err) {
		console.log("updating labels for "+imageFile+"\n");
		if (err) {
		    console.log(err+"\n");
		    sendCode(400,response,"requested photo not found");		    
		} else {
		    // send a nice response back to browser
		    response.status(200);
		    response.type("text/plain");
		    response.send("added label "+newLabel+" to "+imageFile);
		}
	    }

	}
    }
}
