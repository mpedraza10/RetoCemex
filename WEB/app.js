const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())

const dotenv = require('dotenv')
dotenv.config({ path: './env/.env'})

app.use('/resources', express.static('public'))
// app.use('/resources', express.static(__dirname + '/public'))

app.set('view engine', 'ejs')

const bcrypt = require('bcrypt')

// Express session
const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// Require DB
const connection = require('./database/db')

// Login
app.get('/login', (req, res) => {
    res.render('login')
})

// Password
app.get('/register', (req, res) => {
    res.render('register')
})

// Register POST
app.post('/register', async (req, res) => {
    const user = req.body.user
    const name = req.body.name
    const rol = req.body.rol
    const pass = req.body.pass
    let passwordHaash = await bcrypt.hash(pass, 8)
    connection.query('INSERT INTO users SET ?', {user: user, name: name, rol:rol, pass:passwordHaash}, async (error, results) => {
        if(error) {
            console.log(error)
        } else {
            res.render('register', {
                alert:true,
                alertTitle: "Registration",
                alertMessage: "Successful Registration!",
                alertIcon: 'success',
                showConfirmationButton: false,
                time: 1500,
                ruta:''
            })
        }
    })
})

// Register API
app.post('/register/api', async (req, res) => {
    let passwordHaash = await bcrypt.hash(req.body.pass, 8)
    const params = {
        id_empleado: req.body.id_empleado,
        user: req.body.user,
        pass: passwordHaash
    }
    connection.query('INSERT INTO users SET ?', params, async (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.send(`Usuario con user ${params.user} agregado correctamente`)
        }
    })
})

// Login POST
app.post('/auth', async (req, res) => {
    const user = req.body.user
    const pass = req.body.pass
    let passwordHaash = await bcrypt.hash(pass, 8)
    if(user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))) {
                res.render('', {
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o passoword incorrectos!",
                    alertIcon: 'error',
                    showConfirmationButton: true,
                    time: false,
                    ruta:''
                })
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].name
                req.session.user = user
                res.render('', {
                    alert:true,
                    alertTitle: "Conexion Exitosa",
                    alertMessage: "Login correcto!",
                    alertIcon: 'success',
                    showConfirmationButton: false,
                    time: 1500,
                    ruta:'profile'
                })
            }
        })
    } else {
        res.render('login', {
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Ingresa un usuario y contraseña!",
            alertIcon: 'warning',
            showConfirmationButton: false,
            time: false,
            ruta:'login' 
        })
    }
})

// Paginas autenticadas
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('profile', {
            login: true,
            name: req.session.name,
            user: req.session.user,
        })
    } else {
        res.render('index')
    }
})

app.get('/profile', (req, res) => {
    if (req.session.loggedin) {
        res.render('profile', {
            login: true,
            name: req.session.name,
            user: req.session.user,
            id: req.session.id
        })
    } else {
        res.render('index')
    }
})

app.get('/stats', (req, res) => {
    if (req.session.loggedin) {
        res.render('stats', {
            login: true,
            name: req.session.name,
            user: req.session.user
        })
    } else {
        res.render('index')
    }
})

// app.get('/game', (req, res) => {
//     if (req.session.loggedin) {
//         res.render('game', {
//             login: true,
//             name: req.session.name,
//             user: req.session.user
//         })
//     } else {
//         res.render('game')
//     }
// })

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

// Requerimientos para el juego
const path = require('path')
const serveStatic = require('serve-static')
// const { send } = require('process')
// app.use(express.static(path.join(__dirname, + '/bolsas')))

// app.use('/bolsas', express.static('bolsas'))
// app.use('/bolsas', express.static(__dirname + '/bolsas'))
// app.use('/bolsas', express.static('bolsas'))
// app.use('/bolsas', express.static(__dirname + '/bolsas'))
// console.log(path.join(__dirname, '/bolsas'))

// app.use('/bolsas', express.static('bolsas'))

// Juego Bolsas
app.get('/game', (req, res) => {
    if (req.session.loggedin) {
        app.use('/bolsas', express.static('bolsas'))
        res.redirect('/bolsas')
    } else {
        res.redirect('/')
    }
})

// app.get('/game', (req, res) => {
//     if (req.session.loggedin) {
//         app.use(serveStatic(path.join(__dirname, 'bolsas')))
//         res.redirect('/bolsas/index.html')
//     } else {
//         res.send('NOT AUTHENTICATED')
//     }
// })

const port = 2000
app.listen(port, (req, res) => {
    console.log('Listening on port', port)
})