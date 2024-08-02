require('dotenv').config();
const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
    MODE: Joi.string().valid('release', 'dev').required(),
    MINIO_URL: Joi.string().required(),
    MINIO_USER: Joi.string().required(),
    MINIO_PASS: Joi.string().required(),
    MINIO_ENDPOINT: Joi.string().default('127.0.0.1'),
    MONGO_ENDPOINT: Joi.string().default('127.0.0.1'),
    MONGO_DB: Joi.string().default('agile-factory'),
    FTP_USER: Joi.string().required(),
    FTP_PASS: Joi.string().required(),
    SCHEDULE: Joi.string().default('23:59:59')
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);


module.exports = {
    schedule: envVars.SCHEDULE,
    mongo: envVars.MONGO_ENDPOINT,
    mongodb: envVars.MONGO_DB,
    minio: {
        "url": envVars.MINIO_URL,
        "bucket": "agile-factory",
        "options": {
            "endPoint": envVars.MINIO_ENDPOINT,
            "port": 9001,
            "useSSL": false,
            "accessKey": envVars.MINIO_USER,
            "secretKey": envVars.MINIO_PASS
        }
    },
    ftp: { "user": envVars.FTP_USER, "password": envVars.FTP_PASS, server: "94.72.143.145" },
    mode: envVars.MODE
}
