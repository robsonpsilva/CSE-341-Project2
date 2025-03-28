const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const passport = require("passport");
const session = require("express-session");
const giHubStrategy = require("passport-github2").Strategy;

const cors = require("cors");
app.use(cors());

const mongodb = require("./data/database");

const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Defining a user schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

//defining a user model
const User = mongoose.model('User', UserSchema);

app
.use(bodyParser.json())
.use(session({
    secret: "secret",
    resave: false,
    saveUninitialiazed: true,
}))
.use(passport.initialize())
.use(passport.session())
.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})
.use(cors({methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]}))
.use(cors({origin: "*"}))
.use("/", require("./routes/index.js"));

passport.use(new giHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.callback_url

},
function(accessToken, refreshToken, profile, done){
    return done(null,profile)
}
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(( user, done) => {
    done(null, user);
})

// app.use("/", require("./routes"));

app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

app.get("/github/callback", passport.authenticate("github", { 
    failureRedirect: "/api-docs", session: false}),
    (req,res) => {
        req.session.user = req.user;
        res.redirect("/")
    }
);

mongodb.initDb((err) =>{
    if(err){
        console.log(err);
    }
    else{
        app.listen(port, () =>{console.log(`Database and Node running on port ${port}`)});
    }
})