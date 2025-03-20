const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info:{
        title: "Users Api",
        description: "Users Api"
    },
    host: "localhost: 8001",
    schemes: ["https, http"]
} 

const outputFile = "./swaggee.json";
const endPointsFile = ["./routes/index"];

swaggerAutogen(outputFile,endPointsFile,doc);