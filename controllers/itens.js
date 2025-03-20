const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllItens = async (req, res) => {
    try {
        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("itens")
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

const getSingleItem = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        // Validação do formato do ID para garantir que seja válido
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const itemId = new ObjectId(req.params.id);

        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("itens")
            .find({ _id: itemId });

        // Convertendo o resultado em um array
        const contacts = await result.toArray();

        // Verificando se o contato foi encontrado
        if (contacts.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(contacts[0]);
    } catch (error) {
        // Tratamento de erros inesperados
        console.error("Error fetching contact:", error);
        res.status(500).json({ error: "An error occurred while retrieving the item." });
    }
};

const insertItem = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
        // Validação básica
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ error: "All fields are required." });
        }
    
        // Obter referência da coleção do MongoDB
        const contactsCollection = await mongodb.getDatabase().db().collection("itens");
    
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
            message: "Item saved successfully",
            contactId: result.insertedId,
        });
    } catch (error) {
        console.error("Error saving item:", error);
        res.status(500).json({ error: "Failed to save item" });
    }
};

const deleteItem = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const { id } = req.params; // Obtém o ID da URL
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid item id to delete a item.");
        }
        // Verificar se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Obter referência à coleção do MongoDB
        const contactsCollection = await mongodb.getDatabase().db().collection("itens");

        // Excluir o contato com o ID fornecido
        const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

        // Verificar se o contato foi encontrado e excluído
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Item not found." });
        }

        // Responder com sucesso
        res.status(200).json({ message: "Item deleted successfully." });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item." });
    }
};


// Função para atualizar um contato
const updateItem = async (req, res) => {
    try {
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid item id to update a contac.");
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
        const contactsCollection = await mongodb.getDatabase().db().collection("itens");

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
            return res.status(404).json({ error: "Item not found." });
        }

        res.status(200).json({ message: "Item updated successfully." });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Failed to update item." });
    }
};


module.exports = {
    getAllItens,
    getSingleItem,
    insertItem,
    deleteItem,
    updateItem
};