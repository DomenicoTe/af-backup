
require('dotenv').config(); const Joi = require('joi');

const envVarsSchema = Joi.object({ SLACK_TOKEN: Joi.string().required() }).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);

module.exports = envVars.SLACK_TOKEN
