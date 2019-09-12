
var mysql      = require('mysql');
function DBConnect() {
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'daodao',
        password : '123456',
        database : 'TWMovie',
        multipleStatements: true
    });
    return connection;
}

module.exports = {
    DBConnect
};