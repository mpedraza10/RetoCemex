// Load MySql pool connection
const pool = require('../data/config')

// Router para endpoint videojuego de bolsas
const express = require('express')
const { response } = require('express')
const { route } = require('./bolsas')
const router = express.Router()

// Obtener tipo de casa
router.get('/casa/:id', (req, res) => {
    const id = req.params.id
    pool.query('SELECT tipoCasa FROM empleado WHERE id = ?', id, (error, result) => {
        if (error) {
            console.log(error)
            res.send('Error al obtener datos')
        } else {
            res.send(result[0])
        }
    })
})

// Update tipo de casa
router.put('/casa/update', (req, res) => {
    const params = [req.body.tipoCasa, req.body.id]
    pool.query('UPDATE empleado SET tipoCasa = ? WHERE id = ?', params, (error, result) => {
        if (error) {
            console.log(error)
            res.send('Error al actualizar datos')
        } else {
            res.send(`Empleado con id ${req.body.id} se actualizo a la casa ${req.body.tipoCasa}.`)
        }
    })
})

// Insert transacción (compra de casa)
router.post('/transaccion', (req, res) => {
    pool.query('INSERT INTO transacciones SET ?', req.body, (error, result) => {
        if (error) { 
            console.log(error)
            res.send('Error al insertar datos')
        } else {
            res.send(`Transaccion con total de ${req.body.total}, hecha por empleado #${req.body.id_empleado}`)
        }
    })
})

// Update dinero
router.put('/dinero/update', (req, res) => {
    const params = [req.body.dinero, req.body.id]
    pool.query('UPDATE empleado SET dinero = ? WHERE id = ?', params, (error, result) => {
        if (error) {
            console.log(error)
            res.send('Error al actualizar datos')
        } else {
            res.send(`Empleado con id ${req.body.id} se actualizo a la casa ${req.body.dinero}.`)
        }
    })
})

// Obtener dinero de usuario
router.get('/dinero/:id', (req, res) => {
    const id = req.params.id
    pool.query('SELECT dinero FROM empleado WHERE id = ?', id, (error, result) => {
        if (error) {
            console.log(error)
            res.send('Error al obtener datos')
        } else {
            res.send(result[0])
        }
    })
})

router.get('/ranking/', (req, res) => {
    const query = 'SELECT user, tipoCasa FROM empleado JOIN users ON empleado.id = users.id_empleado ORDER BY tipoCasa DESC LIMIT 10'
    pool.query(query, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            var toSend = ''
            for(let i = 0; i < 10; i++){
                if (i === 0){
                    toSend = result[0].user
                } else {
                    toSend = toSend.concat(" ", result[i].user)
                }
            }
            const objToSend = {
                ranking: toSend
            }
            res.send(objToSend)
            // res.send(objToSend)
        }
    })
})

module.exports = router