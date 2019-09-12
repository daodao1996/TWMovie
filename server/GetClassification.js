var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/fenlei', urlencodedParser, function(req, res) {
    let values = req.body;
    //console.log(values);
    let sql = "SELECT image,title,id from movie where genres like '%" + values.kind + "%';";//查分类
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;

        res.send(results);
    });
});

router.post('/', urlencodedParser, function(req, res) {
    let sql = "select genres from movie;";
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        let kinds = getKinds(results);
        res.send(kinds);
    });
});

router.post('/order', urlencodedParser, function(req, res) {
    let values = req.body;
    //console.log(values);
    let sql = "SELECT id,title,image,rating,year from movie where genres like '%"+values.kind+"%' ORDER BY "+values.att+" "+values.way+";";
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        res.send(results);

    });
});
function getKinds(results) {
    let kinds = [];
    results.forEach((item, index, inputs) => {
        let k = item.genres.split(",");
        kinds.push(...k);
    });
    kinds = duplicate(kinds);
    return kinds;
}

function duplicate(kinds) {
    let res = [];
    let scount = countSort(kinds);
    for (let key in scount) {
        res.push(scount[key]);
        //res+=scount[key]+",";
        // if (res.length === 10)
        //return res;
    }
    return res;
}

function countSort(kinds) {
    let count = new Object();
    kinds.forEach(item => {
        if (count.hasOwnProperty(item))
            count[item]++;
        else
            count[item] = 1;
    });
    let scount = Object.keys(count).sort(function(a, b) { return count[b] - count[a]; });
    return scount;
}
module.exports = router;