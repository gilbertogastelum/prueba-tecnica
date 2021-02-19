const mysql = require('mysql');
const { promisify }= require('util');

const {database}= require ('./config/db');

const pool= mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code=== 'PROTOCOL_CONNECTION-LOST'){
            console.error('LA CONEXIÓN CON LA BASE DE DATOS SE HA PERDIDO')
        }
        if(err.code=== 'ECONNREFUSED'){
            console.error("LA CONEXIÓN CON LA BASE DE DATOS SE HA RECHAZADO");
        }
    }
    if (connection){
        connection.release();
    }
    console.log('DB CONECTADA');

  return;
});


// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;