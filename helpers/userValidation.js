const Joi = require("joi");
const StatusCodes = require("http-status-codes");

module.exports = {
  validateSignUp: () => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schemas.signUp);
      if (result.error) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: result.error.details[0].message });
      }
      next();
    };
  }
};

const schemas = {
  signUp: {
    username: Joi.string()
      .min(8)
      .required(),
    password: Joi.string()
      .min(5)
      .required(),
    firstName: Joi.string()
      .min(2)
      .required(),
    lastName: Joi.string()
      .min(2)
      .required()
  }
};
