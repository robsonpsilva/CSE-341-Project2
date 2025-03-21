const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllItens = async (req, res) => {
     //#swagger.tags=["Itens"]
    try {
        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("itens")
            .find();

        // Convertendo o resultado em um array
        const itens = await result.toArray();

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(itens);
    } catch (error) {
        // Tratamento de erros
        console.error("Error fetching itens:", error);

        // Retornando erro 500 (Internal Server Error) ao cliente
        res.status(500).json({error: "An error occurred while retrieving itens." });
    }
};

const getSingleItem = async (req, res) => {
    //#swagger.tags=["Itens"]
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
        const itens = await result.toArray();

        // Verificando se o contato foi encontrado
        if (itens.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(itens[0]);
    } catch (error) {
        // Tratamento de erros inesperados
        console.error("Error fetching contact:", error);
        res.status(500).json({ error: "An error occurred while retrieving the item." });
    }
};
//category
// "Vegetable"
// expiration_date
// "03/30/2025"
// vendor_id
// "0001"
const insertItem = async (req, res) => {
    //#swagger.tags=["Itens"]
    try {
        const { name, quantity, unityprice, description, category, expiration_date, vendor_id } = req.body;
    
        // Validação básica
        if (!name || !quantity || !unityprice || !expiration_date || !vendor_id) {
            return res.status(400).json({ error: "Name, quantity, Unity price, Expiration Date and Vendor Id are required." });
        }
    
        // Obter referência da coleção do MongoDB
        const itensCollection = await mongodb.getDatabase().db().collection("itens");
    
        // Inserir os dados na coleção
        const newItem= {
            name,
            quantity,
            unityprice,
            description, 
            category, 
            expiration_date,
            vendor_id,
        };
    
        const result = await itensCollection.insertOne(newItem);
    
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
    //#swagger.tags=["Itens"]
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
        const itensCollection = await mongodb.getDatabase().db().collection("itens");

        // Excluir o contato com o ID fornecido
        const result = await itensCollection.deleteOne({ _id: new ObjectId(id) });

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
     //#swagger.tags=["Itens"]
    try {
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid item id to update a contac.");
        }
        const { id } = req.params; // ID do registro a ser atualizado
        const { name, quantity, unityprice, description, category, expiration_date, vendor_id } = req.body;

        // Valida o formato do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Valida os dados enviados pelo cliente
        if (!name || !quantity || !unityprice || !expiration_date || !vendor_id) {
            return res.status(400).json({ error: "Name, quantity, Unity price, Expiration Date and Vendor Id are required." });
        }

        // Obter a coleção do MongoDB
        const itensCollection = await mongodb.getDatabase().db().collection("itens");

        // Dados a serem atualizados
        const updatedData = {
            name,
            quantity,
            unityprice,
            description, 
            category, 
            expiration_date,
            vendor_id,
        };

        // Atualizar o contato pelo ID
        const result = await itensCollection.updateOne(
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