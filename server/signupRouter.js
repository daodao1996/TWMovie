var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/',urlencodedParser, function (req, res) {
    let info = req.body;
    let query = "insert into user(username,password,email) values('"+info.username+"','"+info.password+"','"+info.email+"')";
    connection.query(query,function (error, results, fields) {
        if (error) throw error;
        res.send(true);
    });
});

router.post('/username',urlencodedParser, function (req, res) {
    let value = req.body;
    let query = "select username from user";
    connection.query(query,function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});
module.exports = router;


