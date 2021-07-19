const Joi = require('joi')

function validateUser(req, res, next) {

    //--------------Defining a schema--------------------------------
    const schema = Joi.object({
        "name": Joi.string().min(2).regex(/^[A-Za-z0-9]+$/).required(),
        "email": Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        "password": Joi.string().min(2).regex(/^[A-Za-z0-9]+$/).required(),
    })
    try {
        let result = schema.validate(req.body);
        if (result.error != null) {
            if (result.error.details[0].message.includes('[A-Za-z0-9]')) {
                res.status(400).send("Invalid user schema");
                return;
            } else {
                res.status(400).send(result.error.details[0].message);
                return;
            }
        }
    } catch (error) {
        console.error("Error: ", error)
        res.status(400).json({message: "VALIDATION ERROR"});
    }
    next()
}

function validateLogin(req, res, next) {
    console.log("---a: ", req.body)
    const schema = Joi.object({
        "email": Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        "password": Joi.string().min(2).regex(/^[A-Za-z0-9]+$/).required(),
    })

    try {
        let result = schema.validate(req.body);
        if (result.error != null) {
            if (result.error.details[0].message.includes('[A-Za-z0-9]')) {
                res.status(400).json({ message: "Invalid password provided" });
                return;
            } else {
                res.status(400).send(result.error.details[0].message);
                return;
            }

        }
    } catch (error) {
        console.error("Error: ", error)
        res.status(400).json({message: "VALIDATION ERROR"});
    }

    next()
}


function validatePost(req, res, next) {
    const schema = Joi.object({
        "title": Joi.string().min(1).regex(/^[A-Za-z0-9]+$/).required(),
        "description": Joi.string().min(2).regex(/^[A-Za-z0-9]+$/)
    })

    try {
        let result = schema.validate(req.body);
        if (result.error != null) {
            res.status(400).send(result.error.details[0].message);
            return;

        }
    } catch (error) {
        console.error("Error: ", error)
        res.status(400).send({message: "INPUT VALIDATION ERROR"});
    }

    next()
}

function validateUpdatePost(req, res, next) {
    const schema = Joi.object({
        "title": Joi.string().min(1).regex(/^[A-Za-z0-9]+$/),
        "description": Joi.string().min(2).regex(/^[A-Za-z0-9]+$/)
    })

    try {
        let result = schema.validate(req.body);
        if (result.error != null) {
            res.status(400).send(result.error.details[0].message);
            return;

        }
    } catch (error) {
        console.error("Error: ", error)
        res.status(400).send({message: "INPUT VALIDATION ERROR"});
    }

    next()
}

module.exports = {
    validateUser,
    validateLogin,
    validatePost,
    validateUpdatePost
}