require('dotenv').config();
const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
    FTP_USER: Joi.string().required(),
    MINIO_URL: Joi.string().required(),
    MINIO_USER: Joi.string().required(),
    MINIO_PASS: Joi.string().required(),
    QUIET: Joi.boolean().default(true),
    MONGO_DB: Joi.string().default('agile-factory'),
    MINIO_ENDPOINT: Joi.string().default('minio'),
    MONGO_ENDPOINT: Joi.string().default('mongodb'),
    SCHEDULE: Joi.string().default('23:59:59'),
    ENVIROMENT: Joi.string().default('/agile'),
    MODE: Joi.string().valid('release', 'dev').default('release'),
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);


module.exports = {
    mode: envVars.MODE,
    quiet: envVars.QUIET,
    schedule: envVars.SCHEDULE,
    mongo: envVars.MONGO_ENDPOINT,
    mongodb: envVars.MONGO_DB,
    minio: {
        url: envVars.MINIO_URL,
        bucket: "agile-factory",
        options: {
            endPoint : envVars.MINIO_ENDPOINT,
            port : 9001,
            useSSL : false,
            accessKey : envVars.MINIO_USER,
            secretKey : envVars.MINIO_PASS
        }
    },
    ftp: { "user": envVars.FTP_USER, server: "94.72.143.145" },
    environment: envVars.ENVIROMENT
}
