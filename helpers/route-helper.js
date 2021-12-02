const Joi = require('joi');

module.exports = {
    validate_param : (schema, name) => {
        return (req, res, next) => {
            console.log(`validate_param: req.params[${name}]:`, req.params[name]);

            // const result = Joi.validate({param: req['params'][name]}, schema);

            const result = schema.validate({param: req['params'][name]});

            if (result.error) {
                // Error happened
                console.log('validation error'); 
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['params']) {
                    req.value['params'] = {};
                }
                req.value['params'][name] = result.value.param;
                next();
            }            
        }
    },
    validate_body: (schema) => {
        return(req, res, next) => {
            // const result = Joi.validate(req.body, schema);
            const result = schema.validate(req.body);

            if (result.error) {
                console.log(result)
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['body']) {
                    req.value['body'] = {};
                }
                req.value['body'] = result.value;
                next();
            }
        }
    },
    schemas : {
        userSchema: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().email().required()
        }),
        userPatchSchema: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email()
        }),
        idSchema: Joi.object().keys({
            // userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        userNoteSchema: Joi.object().keys({
            title: Joi.string().required(),
            body: Joi.string(),
            share: Joi.boolean(),
            share_pass: Joi.string()
        }),       
        noteSchema: Joi.object().keys({
            owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            title: Joi.string().required(),
            body: Joi.string(),
            share: Joi.boolean(),
            share_pass: Joi.string()
        }),    
        putCarSchema: Joi.object().keys({            
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required(),
            price: Joi.number().required()
        }),            
        patchNoteSchema: Joi.object().keys({            
            title: Joi.string(),
            name: Joi.string()
            // year: Joi.number(),
            // price: Joi.number()
        }),       
    }    
}
