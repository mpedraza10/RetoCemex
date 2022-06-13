const mysql = require('mysql')

const config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'reto_tc2005b'
}

const config_azure = {
    host: 'db-tc2005b.mysql.database.azure.com',
    user: 'jmcg0901',
    password: 'Yeahboi0901$',
    database: 'reto_tc2005b'
}

const pool = mysql.createPool(config_azure)

module.exports = pool