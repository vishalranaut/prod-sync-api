/** @format */

import * as dotenv from "dotenv";
import * as path from "path";
import * as Joi from "joi";

class Config {
  private readonly envVars: any;

  constructor() {
    dotenv.config({ path: path.join(__dirname, "../../.env") });

    const envVarsSchema = Joi.object()
      .keys({
        NODE_ENV: Joi.string()
          .valid("production", "development", "test")
          .required(),
        HOST: Joi.string().default("0.0.0.0"),
        PORT: Joi.number().default(5004),
        MONGODB_URI: Joi.string()
          .required()
          .description("MongoDB connection URI"),
        JWT_SECRET: Joi.string().required().description("JWT secret key"),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
          .default(30)
          .description("minutes after which access tokens expire"),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
          .default(30)
          .description("days after which refresh tokens expire"),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
          .default(10)
          .description("minutes after which reset password token expires"),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
          .default(10)
          .description("minutes after which verify email token expires"),
      })
      .unknown();

    const { value, error } = envVarsSchema
      .prefs({ errors: { label: "key" } })
      .validate(process.env);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    this.envVars = value;
  }

  get env(): string {
    return this.envVars.NODE_ENV;
  }

  get port(): number {
    return this.envVars.PORT;
  }

  get host(): string {
    return this.envVars.HOST;
  }

  get database(): { mongodbURI: string } {
    return {
      mongodbURI: this.envVars.MONGODB_URI,
    };
  }

  get jwt(): {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
  } {
    return {
      secret: this.envVars.JWT_SECRET,
      accessExpirationMinutes: this.envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: this.envVars.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes:
        this.envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes:
        this.envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    };
  }

  get telegram(): { botToken: string } {
    return {
      botToken: this.envVars.TELEGRAM_BOT_TOKEN,
    };
  }
}

export default new Config();
