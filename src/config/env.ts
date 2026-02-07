import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  DATABASE_URL: Joi.string().uri().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SSL: Joi.string(),
  DB_CHANNELBINDING: Joi.string().valid('prefer', 'require', 'disable').default('require'),

  SALT_ROUNDS: Joi.number().default(10),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
})
  .unknown()
  .required();

const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  console.error('❌ Environment variable validation failed:');
  error.details.forEach((d) => {
    console.error(`- ${d.message}`);
  });
  process.exit(1);
}

export const env = {
  port: Number(envVars.PORT),
  nodeEnv: envVars.NODE_ENV,
  corsOrigin: envVars.CORS_ORIGIN,
  databaseUrl: envVars.DATABASE_URL,
  dbHost: envVars.DB_HOST,
  dbPort: Number(envVars.DB_PORT),
  dbUser: envVars.DB_USER,
  dbDatabase: envVars.DB_DATABASE,
  dbPassword: envVars.DB_PASSWORD,
  dbSsl: envVars.DB_SSL,
  dbChannelBinding: envVars.DB_CHANNELBINDING,

  saltRounds: Number(envVars.SALT_ROUNDS),

  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
} as const;
