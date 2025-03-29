const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");

const passport = require("passport");
const session = require("express-session");
const giHubStrategy = require("passport-github2").Strategy;
const userControler = require("./controllers/users");


const mongodb = require("./data/database");

const port = process.env.PORT || 3000;


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
    callbackURL: process.env.CALLBACK_URL

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

app.use("/", require("./routes"));

app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

// app.get("/auth/github/callback", passport.authenticate("github", { 
//     failureRedirect: "/api-docs", session: false}),
//     (req,res) => {
//         req.session.user = req.user;
//         const email = req.session.user.emails?.[0]?.value || 'email-default@example.com'; // Garantir um email padrão
//             const name = req.session.user.displayName || 'Nome padrão';

//             await userController.createUser(email, name);
//         res.redirect("/")
//     }
// );

app.get("/auth/github/callback", passport.authenticate("github", { 
    failureRedirect: "/api-docs", session: false}),
    async (req, res) => {
        const user = req.user;
        
        try {
            const email = user.emails?.[0]?.value || 'email-default@example.com'; // Garantir um email padrão
            const name = user.displayName || 'Defaut name';
            const existingUser = await mongodb
                        .getDatabase()
                        .db()
                        .collection("users")
                        .findOne({ email });
            
            if (!existingUser) {
                await userControler.createUser(email, name); // Salvar no banco
            }
            else{
                await userControler.updateUser(email, name);
            }
            
            console.log("User saved:", email);

            req.session.user = user; // Opcional se desejar salvar na sessão
            res.redirect("/");
        } catch (error) {
            console.error("Error saving user:", error);
            res.status(500).send("Error saving user!");
        }
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