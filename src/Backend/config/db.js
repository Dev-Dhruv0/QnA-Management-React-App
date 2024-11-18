const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "db_QnA",
    password: "MySQLServer@123",
    port: 3306,
    queueLimit: 0
});

db.getConnection()
    .then((connection) => {
        console.log("Connected to MySQL Database!");
        connection.release();
    }) .catch ((error) => {
        console.error("Error Connecting to MySQL Database!", error);
    });
    
module.exports = db;