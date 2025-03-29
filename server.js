const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const passport = require("passport");
const session = require("express-session");
const giHubStrategy = require("passport-github2").Strategy;

const cors = require("cors");

const dotenv = require('dotenv').config();
const mongodb = require("./data/database");
const port = process.env.PORT || 3000;


// Configuração de sessão
app.use(session({ secret: 'seu_segredo_aqui', resave: false, saveUninitialized: true }));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração do Passport com GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Rotas
app.get('/', (req, res) => {
  res.send(`<h1>Bem-vindo!</h1> <a href="/auth/github">Entrar com GitHub</a>`);
});

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Olá, ${req.user.username}!</h1> <a href="/logout">Sair</a>`);
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

mongodb.initDb((err) =>{
    if(err){
        console.log(err);
    }
    else{
        app.listen(port, () =>{console.log(`Database and Node running on port ${port}`)});
    }
});


// app.use(cors());

// app
// .use(bodyParser.json())
// .use(session({
//     secret: "secret",
//     resave: false,
//     saveUninitialiazed: true,
// }))
// .use(passport.initialize())
// .use(passport.session())
// .use((req,res,next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers",
//         "Origin, X-Request-With, Content-Type, Accept, Z-Key"
//     );
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
// })
// .use(cors({methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]}))
// .use(cors({origin: "*"}))
// .use("/", require("./routes/index.js"));


// passport.use(new giHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL

// },
// function(accessToken, refreshToken, profile, done){
//     return done(null,profile)
// }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser(( user, done) => {
//     done(null, user);
// });




// // app.use("/", require("./routes"));

// app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

// app.get("/github/callback", passport.authenticate("github", { 
//     failureRedirect: "/api-docs", session: false}),
//     (req,res) => {
//         req.session.user = req.user;
//         res.redirect("/")
//     }
// );



