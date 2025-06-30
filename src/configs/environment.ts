import 'dotenv/config';

const env = process.env;

export const environment = {
  APP_PORT: Number(env.APP_PORT),

  GEMINI: {
    API_KEY: env.API_KEY,
    MODEL_NAME: String(env.MODEL_NAME),
    MODEL_NAME2: String(env.MODEL_NAME2),
  },
};
