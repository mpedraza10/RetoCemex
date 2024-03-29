const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

app.use("/resources", express.static("public"));
// app.use('/resources', express.static(__dirname + '/public'))

app.set("view engine", "ejs");

const bcrypt = require("bcrypt");

// Express session
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Require DB
const connection = require("./database/db");

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

// Password
app.get("/register", (req, res) => {
  res.render("register");
});

// Register POST
app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  let passwordHaash = await bcrypt.hash(pass, 8);
  connection.query(
    "INSERT INTO users SET ?",
    { user: user, name: name, rol: rol, pass: passwordHaash },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("register", {
          alert: true,
          alertTitle: "Registration",
          alertMessage: "Successful Registration!",
          alertIcon: "success",
          showConfirmationButton: false,
          time: 1500,
          ruta: "",
        });
      }
    }
  );
});

// Register API
app.post("/register/api", async (req, res) => {
  let passwordHaash = await bcrypt.hash(req.body.pass, 8);
  const params = {
    id_empleado: req.body.id_empleado,
    user: req.body.user,
    pass: passwordHaash,
  };
  connection.query(
    "INSERT INTO users SET ?",
    params,
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(`Usuario con user ${params.user} agregado correctamente`);
      }
    }
  );
});

// Login POST
/* app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHaash = await bcrypt.hash(pass, 8);
  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (error, results) => {
        const id = results[0].id;
        if (
          results.length == 0 ||
          !(await bcrypt.compare(pass, results[0].pass))
        ) {
          res.render("", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o passoword incorrectos!",
            alertIcon: "error",
            showConfirmationButton: true,
            time: false,
            ruta: "",
          });
        } else {
          connection.query(
            "SELECT nombre, apellido_p, id, stories_totales, dinero, tipoCasa, num_vidas FROM empleado WHERE id = ?",
            id,
            (error, resultados) => {
              req.session.nombre =
                resultados[0].nombre + " " + resultados[0].apellido_p;
              req.session.stories_totales = resultados[0].stories_totales;
              req.session.dinero = resultados[0].dinero;
              req.session.tipoCasa = resultados[0].tipoCasa;
              req.session.vidas = resultados[0].num_vidas;
            }
          );
          //console.log(req.session.nombre);
          req.session.hola = "hola";
          req.session.loggedin = true;
          // req.session.name = results[0].name
          req.session.user = user;
          res.render("", {
            alert: true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Login correcto!",
            alertIcon: "success",
            showConfirmationButton: false,
            time: 1500,
            ruta: "profile",
          });
        }
      }
    );
  } else {
    res.render("login", {
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "Ingresa un usuario y contraseña!",
      alertIcon: "warning",
      showConfirmationButton: false,
      time: false,
      ruta: "login",
    });
  }
});
 */

// Login POST
app.post('/auth', async (req, res) => {
  const user = req.body.user
  const pass = req.body.pass
  let passwordHaash = await bcrypt.hash(pass, 8)
  if(user && pass) {
      query = 'SELECT user, pass, nombre, apellido_p, empleado.id, num_vidas, stories_totales, dinero, tipoCasa FROM empleado JOIN users ON users.id_empleado = empleado.id WHERE user = ?'
      connection.query(query, [user], async (error, results) => {
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

              console.log(results)
              req.session.loggedin = true
              req.session.user = results[0].user
              req.session.nombre = results[0].nombre + ' ' + results[0].apellido_p
              req.session.stories_totales = results[0].stories_totales
              req.session.dinero = results[0].dinero
              req.session.tipoCasa = results[0].tipoCasa
              req.session.num_vidas = results[0].num_vidas

              res.render('', {
                  alert:true,
                  alertTitle: "Conexion Exitosa",
                  alertMessage: "Login correcto!",
                  alertIcon: 'success',
                  showConfirmationButton: false,
                  time: 1500,
                  ruta:'profile'
              })
              res.end()
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
      res.end()
  }
})

// Paginas autenticadas
app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("profile", {
      login: true,
      name: req.session.name,
      user: req.session.user,
    });
  } else {
    res.render("index");
  }
});

app.get("/profile", (req, res) => {
  if (req.session.loggedin) {
    console.log(req.session);
    res.render("profile", {
      login: true,
      name: req.session.nombre,
      user: req.session.user,
      tipoCasa: req.session.tipoCasa
    });
  } else {
    res.render("index");
  }
});

app.get("/stats", (req, res) => {
  if (req.session.loggedin) {
    res.render("stats", {
      login: true,
      name: req.session.name,
      user: req.session.user,
      tipoCasa: req.session.tipoCasa,
      dinero: req.session.dinero,
      stories_totales: req.session.stories_totales,
      num_vidas: req.session.num_vidas
    });
  } else {
    res.render("index");
  }
});

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
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Requerimientos para el juego
const path = require("path");
const serveStatic = require("serve-static");
// const { send } = require('process')
// app.use(express.static(path.join(__dirname, + '/bolsas')))

// app.use('/bolsas', express.static('bolsas'))
// app.use('/bolsas', express.static(__dirname + '/bolsas'))
// app.use('/bolsas', express.static('bolsas'))
// app.use('/bolsas', express.static(__dirname + '/bolsas'))
// console.log(path.join(__dirname, '/bolsas'))

// app.use('/bolsas', express.static('bolsas'))

// Juego Bolsas
app.get("/game", (req, res) => {
  if (req.session.loggedin) {
    app.use("/bolsas", express.static("bolsas"));
    res.redirect("/bolsas");
  } else {
    res.redirect("/");
  }
});

// Juego Bolsas
app.get("/gameCasas", (req, res) => {
  if (req.session.loggedin) {
    app.use("/casas", express.static("casas"));
    res.redirect("/casas");
  } else {
    res.redirect("/");
  }
});

// app.get('/game', (req, res) => {
//     if (req.session.loggedin) {
//         app.use(serveStatic(path.join(__dirname, 'bolsas')))
//         res.redirect('/bolsas/index.html')
//     } else {
//         res.send('NOT AUTHENTICATED')
//     }
// })

const port = 2000;
app.listen(port, (req, res) => {
  console.log("Listening on port", port);
});
