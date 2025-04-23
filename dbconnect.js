const db = require('mariadb');
//const dotenv = require('dotenv').config()

const pool = db.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit:5,
})

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('database connection lost');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('database has too many connection');
        }
        if(err.code==='ECONNREFUSED'){
            console.error('database connection was refused');
        }
    }
    if (connection) connection.release();
    return;
})


module.exports = pool