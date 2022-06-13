const mysql = require('mysql')
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// })

// connection.connect((error) => {
//     if(error) {
//         console.log('El error de conexion es:', error)
//         return;
//     }
//     console.log('Conectado a la Base de Datos!')
// })

const config_azure = {
    host: 'db-tc2005b.mysql.database.azure.com',
    user: 'jmcg0901',
    password: 'Yeahboi0901$',
    database: 'reto_tc2005b'
}

const connection = mysql.createPool(config_azure)

module.exports = connection