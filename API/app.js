// Load MySql pool connection
const pool = require('./data/config')

// Body parser
const bodyParser = require('body-parser')

// Express
const express = require('express')
const { response } = require('express')
const app = express()

// Cors
const cors = require('cors')
app.use(cors())

const port = process.env.PORT || 3000

// Importar routes
const bolsasRoutes = require('./routes/bolsas')
const casasRoutes = require('./routes/casas')

// Parse application/json
app.use(bodyParser.json())

// Cargar routes para usarlas
app.use(bolsasRoutes)
app.use(casasRoutes)

// Listen on port 3000 (Local)
app.listen(port, () => {
    console.log('Listening on port', port)
})