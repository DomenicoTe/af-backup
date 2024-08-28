
require('dotenv').config();
const Joi = require('joi');

const envVarsSchema = Joi.object({
    SECRET_IV : Joi.string().default('4a05e16ae919238015240deef31f62dc'),
    SECRET_KEY: Joi.string().default('13d9e09fafd820cfee7f831b67365e0372eda4a494cb591c2e01fc6fc40abfbd'),
    SECRET_DATA : Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);


module.exports = {
    secret_iv: envVars.SECRET_IV,
    secret_key: envVars.SECRET_KEY,
    secret_data: envVars.SECRET_DATA
}
