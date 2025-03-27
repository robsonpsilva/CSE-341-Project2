const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info:{
        title: "Contacts and Itens Api",
        description: "Contacts and Itens Api"
    },
    // host: "cse-341-project2-8oxr.onrender.com",

    host: "localhost:3000",
    schemes: ["http"]
} 

const outputFile = "./swagger.json";
const endPointsFile = ["./routes/index"];

swaggerAutogen(outputFile,endPointsFile,doc);