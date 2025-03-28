const router = require('express').Router();

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
        </html>`);});

const passport = require('passport');
const contactsController = require("../controllers/contacts");
const itensControler = require("../controllers/itens");
const userControler = require("../controllers/users");

const validation = require("../middleware/validate");

const {isAuthenticated} = require( "../middleware/authenticate");

// Route for contacts
router.get(
    //#swagger.tags=[Get all contacts]
    "/contacts", isAuthenticated, contactsController.getAll); // Route to search all contacts
router.get("/contacts/:id", isAuthenticated, isAuthenticatedcontactsController.getSingle); // Route to search for a contact by ID
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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
        const result = await createUser(email, password);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);
        return res.status(400).json({ error: error.message });
    }
});

// Rota para atualizar senha do usuário
router.put("/update-user", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res
            .status(400)
            .json({ error: "Email e nova senha são obrigatórios" });
    }

    try {
        const result = await updateUser(email, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error.message);
        return res.status(400).json({ error: error.message });
    }
});

// Rota para autenticar (login) do usuário
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
        const result = await authenticateUser(email, password);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error.message);
        return res.status(400).json({ error: error.message });
    }
});

//routes for user creation, login and logout


router.get("/login-oauth", passport.authenticate("github"), (req, res) => {});

router.get("/logout-oauth", function(req, res, next){
    if (isAuthenticated){
        req.logOut(function(err){
            if (err) { return next(err);}
        }); 
        res.redirect("/");  
    }
    res.send("Você não está logado.");
    
});

module.exports = router;