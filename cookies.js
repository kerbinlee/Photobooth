// sets cookie for session if not found
// also initializes database for session
// code adapted from https://dustinpfister.github.io/2018/05/30/express-cookie-parser/

let express = require('express'),

router = module.exports = express.Router();

router.use(require('cookie-parser')());

router.use(function (req, res, next) {
    // read session id from cookie
    let sid = req.cookies.sid;
    // if session id does not exist
    if (!sid) {
        // crude id generator for now
        let id = new Date().getTime().toString();
        // create new database with session id
        createDb(id);
        res.cookie('sid', id);
        req.cookies.sid = id;
        console.log("Set cookie with session id " + id);
    } else {
        console.log("Found cookie with session id " + sid);
    }

    next();
});

// create database with session id as name
function createDb(sid) {
    console.log("Creating database for session " + sid);

    // use SQLite3
    var sqlite3 = require("sqlite3").verbose();
    // use session id as name
    var dbFile = sid+".db";
    var db = new sqlite3.Database(dbFile);

    // command to create table in database
    var cmdStr = "CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)"
    // run command to create table
    db.run(cmdStr);
}
