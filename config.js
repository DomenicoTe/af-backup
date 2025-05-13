require('dotenv').config()
const Joi = require('joi');


const schema = Joi.object({
    ENV: Joi.string().valid('./agile-factory','/agile-factory', '/agilefactory').default('/agile-factory'),
    MODE: Joi.string().valid('release', 'dev').default('release'),
    FTP_USER: Joi.string().required(),
    FTP_PASS: Joi.string().required(),
    MINIO_URL: Joi.string().required(),
    MINIO_USER: Joi.string().required(),
    MINIO_PASS: Joi.string().required(),
    MINIO_ENDPOINT: Joi.string().default('minio'),
    MONGO_DB: Joi.string().default('agile-factory'),
    MONGO_ENDPOINT: Joi.string().default('mongodb'),
    SLACK_WEBHOOK: Joi.string().default('NO'),
    INCLUDE: Joi.string().default(''),
}).unknown().required();
const { error, value } = schema.validate(process.env)
if (error) throw new Error(`Environment variable validation error: ${error.message}`)


module.exports = {
    env: value.ENV,
    root: "./Backup",
    mode: value.MODE,
    mongo: { db: value.MONGO_DB, url: value.MONGO_ENDPOINT },
    minio: {
        url: value.MINIO_URL,
        bucket: 'agile-factory',
        options: {
            endPoint: value.MINIO_ENDPOINT,
            port: 9001,
            useSSL: false,
            accessKey: value.MINIO_USER,
            secretKey: value.MINIO_PASS
        }
    },
    backup: {
        user: value.FTP_USER,
        pass: value.FTP_PASS,
        server: "94.72.143.145"
    },
    hook: value.SLACK_WEBHOOK,
    include: ['env', '/etc/fstab', value.INCLUDE.split(' ')].filter(Boolean)
    // include: ['env', value.INCLUDE.split(' ')].filter(Boolean)
}
