const router = require('express').Router();
const passport = require('passport');
const contactsController = require("../controllers/contacts");
const itensControler = require("../controllers/itens");
const userControler = require("../controllers/users");
const validation = require("../middleware/validate");
const {isAuthenticated} = require( "../middleware/authenticate");


router.use("/",require("./swagger"));
router.get("/", (req,res) => {res.send(`<html>
            <head>
                <title>Robson Paulo da Silva</title>
            </head>
            <body>
                <h1>Welcome to Project: Contacts Part 2 Exercise</h1>
                <p>Click on the links below</p>
                <ul>
                    <li><a href=https://cse-341-project1-t08e.onrender.com/contacts>All contacts</a>></li>
                    <li><a href=https://cse-341-project1-t08e.onrender.com/contacts/67ca09d206dd9a333bc7be0e>Contact Id: ca09d206dd9a333bc7be0e </a></li>
                </ul>
            </body>
        </html>`);
});

// Route for contacts
router.get(
    //#swagger.tags=[Get all contacts]
    "/contacts", isAuthenticated, contactsController.getAll); // Route to search all contacts
router.get("/contacts/:id", isAuthenticated, contactsController.getSingle); // Route to search for a contact by ID
router.post("/contacts", isAuthenticated, validation.saveContact, contactsController.insertContact); // Route to create contact
router.put("/contacts/:id", isAuthenticated, validation.saveContact,contactsController.updateContact);//route to update contact
router.delete("/contacts/:id", isAuthenticated, contactsController.deleteContact); //Route to delete contact


//Routes for itens
router.get(
    //#swagger.tags=[Get all itens]
    "/itens", isAuthenticated, itensControler.getAllItens); // Route to search all itens
router.get("/itens/:id", isAuthenticated, itensControler.getSingleItem); // Route to search for a item by ID
router.post("/itens", isAuthenticated, validation.saveItem, itensControler.insertItem); // Route to create item
router.put("/itens/:id", isAuthenticated, validation.saveItem, itensControler.updateItem);//route to update item
router.delete("/itens/:id", isAuthenticated, itensControler.deleteItem); //Route to delete item


// Rota para criar usuário
router.post("/create-user", async (req, res) => {
    //#swagger.tags=[Create user]
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const result = await userControler.createUser(email, password);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error creating user:", error.message);
        return res.status(400).json({ error: error.message });
    }
});

// Rota para atualizar senha do usuário
router.put("/update-user", async (req, res) => {
    //#swagger.tags=[Update user]
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res
            .status(400)
            .json({ error: "Email e nova senha são obrigatórios" });
    }

    try {
        const result = await userControler.updateUser(email, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error.message);
        return res.status(400).json({ error: error.message });
    }
});

// // Rota para autenticar (login) do usuário
// router.post("/login", async (req, res) => {
//     //#swagger.tags=[Update user]
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email e senha são obrigatórios" });
//     }

//     try {
//         const result = await userControler.authenticateUser(email, password);
//         return res.status(200).json(result);
//     } catch (error) {
//         console.error("Erro ao autenticar usuário:", error.message);
//         return res.status(400).json({ error: error.message });
//     }
// });



// router.get("/status", (req, res) => {
//     if (req.isAuthenticated) {
//         res.status(200).json({ message: "Você está autenticado!", user: req.user });
//     } else {
//         res.status(401).json({ message: "Você não está autenticado." });
//     }
// });

router.get("/loginoauth", (req, res, next) => {
    passport.authenticate("github", (err, user, info) => {
        if (err) {
            console.error("Erro na autenticação:", err);
            return res.status(500).json({ error: "Erro na autenticação." });
        }
        if (!user) {
            console.error("Usuário não autenticado:", info);
            return res.status(401).json({ error: "Autenticação falhou." });
        }

        // Se tudo der certo, faça login e prossiga
        req.logIn(user, (err) => {
            if (err) {
                console.error("Erro ao fazer login:", err);
                return res.status(500).json({ error: "Erro ao fazer login." });
            }
            console.log("Login bem-sucedido!");
            return res.status(200).json({ message: "Login bem-sucedido!" });
        });
    })(req, res, next);
});

router.get("/logoutoauth", function(req,res,next){
     req.logOut(function(err){
         if(err) {return next(err);}
         res.redirect("/");
     });
 });



module.exports = router;