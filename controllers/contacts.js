const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        //#swagger.tags=["Contacts"]
        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("contacts")
            .find();

        // Convertendo o resultado em um array
        const contacts = await result.toArray();

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(contacts);
    } catch (error) {
        // Tratamento de erros
        console.error("Error fetching contacts:", error);

        // Retornando erro 500 (Internal Server Error) ao cliente
        res.status(500).json({error: "An error occurred while retrieving contacts." });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        // Validação do formato do ID para garantir que seja válido
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const contactId = new ObjectId(req.params.id);

        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("contacts")
            .find({ _id: contactId });

        // Convertendo o resultado em um array
        const contacts = await result.toArray();

        // Verificando se o contato foi encontrado
        if (contacts.length === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(contacts[0]);
    } catch (error) {
        // Tratamento de erros inesperados
        console.error("Error fetching contact:", error);
        res.status(500).json({ error: "An error occurred while retrieving the contact." });
    }
};

const insertContact = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
        // Validação básica
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ error: "All fields are required." });
        }
    
        // Obter referência da coleção do MongoDB
        const contactsCollection = await mongodb.getDatabase().db().collection("contacts");
    
        // Inserir os dados na coleção
        const newContact = {
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday, // Certifique-se de enviar uma data válida
        };
    
        const result = await contactsCollection.insertOne(newContact);
    
        // Retorna a resposta de sucesso
        res.status(201).json({
            message: "Contact saved successfully",
            contactId: result.insertedId,
        });
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ error: "Failed to save contact" });
    }
};

const deleteContact = async (req, res) => {
    ///#swagger.tags=["Contacts"]
    try {
        const { id } = req.params; // Obtém o ID da URL
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid contac id to delete a contac.");
        }
        // Verificar se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Obter referência à coleção do MongoDB
        const contactsCollection = await mongodb.getDatabase().db().collection("contacts");

        // Excluir o contato com o ID fornecido
        const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

        // Verificar se o contato foi encontrado e excluído
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Contact not found." });
        }

        // Responder com sucesso
        res.status(200).json({ message: "Contact deleted successfully." });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ error: "Failed to delete contact." });
    }
};


// Função para atualizar um contato
const updateContact = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid contac id to update a contac.");
        }
        const { id } = req.params; // ID do registro a ser atualizado
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        // Valida o formato do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Valida os dados enviados pelo cliente
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Obter a coleção do MongoDB
        const contactsCollection = await mongodb.getDatabase().db().collection("contacts");

        // Dados a serem atualizados
        const updatedData = {
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday,
        };

        // Atualizar o contato pelo ID
        const result = await contactsCollection.updateOne(
            { _id: new ObjectId(id) }, // Filtro pelo ID
            { $set: updatedData } // Atualização parcial
        );

        // Verifica se o registro foi encontrado e atualizado
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Contact not found." });
        }

        res.status(200).json({ message: "Contact updated successfully." });
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ error: "Failed to update contact." });
    }
};


module.exports = {
    getAll,
    getSingle,
    insertContact,
    deleteContact,
    updateContact
};