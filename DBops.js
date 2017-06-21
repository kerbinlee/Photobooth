// Doing stuff with a database in Node.js

// Table was created with:
// CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)

var portNumber = 7829;

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB

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

console.log("starting DB operations");

/* this server uses the express framework */
var express = require('express');
var formidable = require('formidable');  // for uploading images in forms

// make a new express server object
var app = express();

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public directory
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is ***
app.get('/query', function (request, response) 
{
    console.log("query");
    query = request.url.split("?"); // parse query string
    if (query[1]) 
    {   
        if(query[1] == "load_images")
        {
            console.log(query[1]);
            var insertR ="";
            db.all('SELECT * FROM photoLabels',function(err, tableData) 
                   {
                    if (err) 
                        {
                            console.log("error: ",err,"\n");
                        } 
                        else 
                        {
                            console.log("got_me: ",tableData,"\n");
                            response.status(200);
                            response.type("text/json");
                            response.send(tableData);
                        }
                    });
        }//end if
        
        
        
        if(query[1]=="get_labels_example")
        {        
            answer(query[2], response);
        }
          
        
      
   
    } else 
    {
	sendCode(400,response,'query not recognized');
    }

    
    
});

// Case 3: upload images
// Responds to any POST request
app.post('/query', function (request, response){
    
     console.log("query");
    query = request.url.split("?");
    console.log("query[1] "+ query[1]);
if(query[1]){
    

if(query[1] == "load_image")
    {
        
        
    var form = new formidable.IncomingForm(); //Here comes form FormData, on the otherend of Upload. 
    form.parse(request); // figures out what files are in form
    // callback for when a file begins to be processed
    form.on('fileBegin', function (name, file){
	// put it in /public
	file.path = __dirname + '/public/' + file.name;
        
        
          var fileName =  encodeURI(file.name);
        
        
        db.run(
	'INSERT OR REPLACE INTO photoLabels VALUES ("'+fileName+'", "", 0)',
	errorCallback);  
        
      
    console.log("ENCODEURI, check file.name:" + 'INSERT OR REPLACE INTO photoLabels VALUES ("'+fileName+'", "", 0)');
	console.log("uploading ",file.name,name);
    });//End form.on('fileBegin')

    // callback for when file is fully recieved
    form.on('end', function (){
	console.log('success');
	sendCode(201,response,'recieved file');  // respond to browser
    });
        
        
        
        
    }
     else if(query[1] == "delete_tag") 
       {

    console.log("delete_tag query[3] is: " + query[3]);
    var imageName   = query[2];
    var labelsTotalAndAdded = query[3];
    console.log("imageName:  "+imageName);
    console.log(imageName);
    console.log(labelsTotalAndAdded);
             
                    console.log("success, delete label");
                         db.all('UPDATE photoLabels SET labels = ? WHERE fileName = ? ',
	       [labelsTotalAndAdded, query[2]],function(err) 
             {
                if (err) {
                console.log("error: ",err,"\n");
                } 
                else {
                 response.status(201);
                 response.type("text/json");
                 response.send("added label to labels");
                    
                }

             });
                
            }
        
else if(query[1]=="add_label"){
    
    
    
    
    
    console.log("add_label_Start query[3] is: " + query[3]);
    var imageName   = query[2];
    var labelsTotalAndAdded = query[3];
    console.log("imageName:  "+imageName);
    console.log(imageName);
    console.log(labelsTotalAndAdded);
             
                    console.log("success, added first label");
                         db.all('UPDATE photoLabels SET labels = ? WHERE fileName = ? ',
	       [labelsTotalAndAdded, query[2]],function(err) 
             {
                if (err) {
                console.log("error: ",err,"\n");
                } 
                else {
                 response.status(201);
                 response.type("text/json");
                 response.send("added label to labels");
                    
                }

             });
                
            
    }//endif(query[1]=="add_label")
 else if(query[1]=="mark_favorite"){
    
    console.log("mark_favorite start query[3] is: " + query[3]);

             
                    console.log("success, added first label");
                    db.all('UPDATE photoLabels SET favorite = ? WHERE fileName = ? ',
	       [query[3], query[2]],function(err) 
             {
                if (err) {
                console.log("error: ",err,"\n");
                } 
                else {
                 response.status(201);
                 response.type("text/json");
                 response.send("added label to labels");
                    
                }

             });
                
            
    }//endif(query[1]=="mark_favorite")
    
 
}//end if (query[1]) 
else {
sendCode(400,response,'query not recognized');
}

});

// tell express to listen to correct port number
app.listen(portNumber);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}
    
// Stuff for dummy query answering
// We'll replace this with a real database someday! 
function answer(query, response) {
var labels = {hula:
"Dance, Performing Arts, Sports, Entertainment, QuinceaÃ±era, Event, Hula, Folk Dance",
	      eagle: "Bird, Beak, Bird Of Prey, Eagle, Vertebrate, Bald Eagle, Fauna, Accipitriformes, Wing",
	      redwoods: "Habitat, Vegetation, Natural Environment, Woodland, Tree, Forest, Green, Ecosystem, Rainforest, Old Growth Forest"};

    console.log("answering");
    kvpair = query.split("=");
    labelStr = labels[kvpair[1]];
    if (labelStr) {
	    response.status(200);
	    response.type("text/json");
	    response.send(labelStr);
    } else {
	    sendCode(400,response,"requested photo not found");
    }
}


function get_images(query, response) {

    console.log("loading_all_Images");
    kvpair = query.split("=");
    labelStr = labels[kvpair[1]];
    if (labelStr) {
	    response.status(200);
	    response.type("text/json");
	    response.send(labelStr);
    } else {
	    sendCode(400,response,"requested photo not found");
    }
}