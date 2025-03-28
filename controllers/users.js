const mongodb = require("../data/database");
const bcrypt = require("bcrypt");

// Função para criar um novo usuário
const createUser = async (email, password) => {
    try {
        // Verifica se o email já está cadastrado
        const existingUser = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .findOne({ email });

        if (existingUser) {
            throw new Error("Email já cadastrado");
        }

        // Criptografa a senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insere um novo usuário na coleção "users"
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .insertOne({ email, password: hashedPassword });

        if (!result.acknowledged) {
            throw new Error("Erro ao criar o usuário");
        }

        return { message: "Usuário criado com sucesso!" };
    } catch (error) {
        throw error;
    }
};

// Função para atualizar a senha do usuário
const updateUser = async (email, newPassword) => {
    try {
        // Verifica se o usuário existe
        const existingUser = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .findOne({ email });

        if (!existingUser) {
            throw new Error("Usuário não encontrado");
        }

        // Criptografa a nova senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Atualiza o campo "password" no banco
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .updateOne(
                { email }, // Localiza o usuário pelo email
                { $set: { password: hashedPassword } } // Atualiza a senha
            );

        if (result.matchedCount === 0) {
            throw new Error("Não foi possível atualizar o usuário");
        }

        return { message: "Senha atualizada com sucesso!" };
    } catch (error) {
        throw error;
    }
};

// Função para autenticar o usuário (login)
const authenticateUser = async (email, password) => {
    try {
        // Verifica se o usuário existe pelo email
        const user = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .findOne({ email });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        // Compara a senha fornecida com o hash armazenado
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Senha incorreta");
        }

        // Retorna uma mensagem de sucesso ou informações do usuário
        return { message: "Autenticação bem-sucedida", user };
    } catch (error) {
        throw error;
    }
};

module.exports = { authenticateUser, createUser, updateUser };