import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

export interface SecureOptions {
  algorithms: string[];
  audience: string;
  issuer: string;
  jwksUri: string;
}

export const secure = (options: SecureOptions) => {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: options.jwksUri,
    }),
    audience: options.audience,
    issuer: options.issuer,
    algorithms: options.algorithms,
  });
};
