
require('dotenv').config();
const Joi = require('joi');

const envVarsSchema = Joi.object({
    SECRET_IV : Joi.string().default('4a05e16ae919238015240deef31f62dc'),
    SECRET_DATA : Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);


module.exports = {
    secret_iv: envVars.SECRET_IV,
    secret_data: envVars.SECRET_DATA
}
