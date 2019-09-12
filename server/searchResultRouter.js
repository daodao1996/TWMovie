var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    let sql = "SELECT id,title,image from movie where title like '%"+values.keyWord+"%';";
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

router.post('/sort',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    let sql = "SELECT id,title,image,rating,year from movie where title like '%"+values.keyWord+"%' ORDER BY "+values.att+" "+values.way+";";
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

module.exports = router;


