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

const saveItem = (req, res, next) =>  {
    const validationRule = {
        name: "required|string",
        value: "required|string",
        quantity: "required|email",
        unityprice: "required|string"
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

