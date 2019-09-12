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
    let infoSql = "SELECT * from movie where id='"+values.id+"';select username,comment from comments where movieid='"+values.id+"';";
    connection.query(infoSql, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

router.post('/recommend',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    let infoSql = "SELECT id,title,image from movie where genres like '%"+values.kind+"%'";
    connection.query(infoSql, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

router.post('/rating',urlencodedParser,function (req,res) {
    let values = req.body;
    let newScore = 0;
    let Rating,RatingCount;
    let userScore = parseInt(values.score);
    let sql = "SELECT rating,ratingCount from movie where id='"+values.id+"';";
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        Rating=parseFloat(results[0].rating);
        RatingCount = parseInt(results[0].ratingCount);
        newScore = (Rating*RatingCount+userScore)/(RatingCount+1);
        updateScore(newScore,++RatingCount,values.id);
        res.send(true);
    });
});

router.post('/comment',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    let sql = "insert into comments(movieid,username,comment) values('"+values.movieid+"','"+values.username+"','"+values.comment+"')";
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.send(true);
    });
});


function updateScore(newScore,count,id) {
    let updateSql = "update movie set rating='"+newScore+"',ratingCount='"+count+"' where id='"+id+"';";
    connection.query(updateSql, function (error, results, fields) {
        if (error) throw error;
        return results;
    });
}

module.exports = router;


