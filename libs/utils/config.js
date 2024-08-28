
require('dotenv').config();
const Joi = require('joi');

const envVarsSchema = Joi.object({
    SECRET_IV : Joi.string().required(),
    SECRET_KEY: Joi.string().required(),
    SECRET_DATA : Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);


module.exports = {
    secret_iv: envVars.SECRET_IV,
    secret_key: envVars.SECRET_KEY,
    secret_data: envVars.SECRET_DATA
}
