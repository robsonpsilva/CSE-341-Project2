const validator = require("../helpers/validate");

const saveContact = (req, res, next) =>  {
    const validationRule = {
        firstName: "required|string",
        lastName: "required|string",
        email: "required|email",
        favoriteColor: "required|string",
        birthday: "string"

    };
    validator(req.body, validationRule, {}, (err,status) => {
        if (!status){
            res.status(412).send({
                success: false,
                message: "Contact validation failed",
                data: err
            });
        } else{
            next();
        }
    });
};
//name, quantity, unityprice, description
//category
// "Vegetable"
// expiration_date
// "03/30/2025"
// vendor_id
// "0001"
const saveItem = (req, res, next) =>  {
    const validationRule = {
        name: "required|string",
        quantity: "required|numeric",
        unityprice: "required|numeric",
        description: "string",
        category: "string",
        expiration_date: "required|date",
        vendor_id: "required|string"
    };
    validator(req.body, validationRule, {}, (err,status) => {
        if (!status){
            res.status(413).send({
                success: false,
                message: "Item validation failed",
                data: err
            });
        } else{
            next();
        }
    });
};

module.exports = {
    saveContact,
    saveItem
};

