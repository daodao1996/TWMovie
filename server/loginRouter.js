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
   let sql = "SELECT password from user where username='"+values.username+"';"
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if(results[0].password===values.password)
            res.send(true);
        else
            res.send(false);
    });
});

module.exports = router;


