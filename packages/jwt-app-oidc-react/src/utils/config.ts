// @ts-nocheck

export interface Config {
  auth: {
    algorithms: string[];
    audience: string;
    authority: string;
    clientId: string;
    domain: string;
    endpoints: {
      authorize: string;
      logout: string;
      register: string;
      revoke: string;
      token: string;
      userinfo: string;
    };
    issuer: string;
    jwksUrl: string;
    openIdConfigurationUrl: string;
    scope: string;
    storeUserInSessionStorage: boolean;
  };
}

export const config: Config = {
  auth: {
    algorithms: [process.env.AUTH_ALGORITHM],
    audience: process.env.AUTH_AUDIENCE,
    authority: process.env.AUTH_AUTHORITY,
    clientId: process.env.AUTH_CLIENT_ID,
    domain: process.env.AUTH_DOMAIN,
    endpoints: {
      authorize: process.env.AUTH_AUTHORIZE_ENDPOINT,
      logout: process.env.AUTH_LOGOUT_ENDPOINT,
      register: process.env.AUTH_REGISTER_ENDPOINT,
      revoke: process.env.AUTH_REVOKE_ENDPOINT,
      token: process.env.AUTH_TOKEN_ENDPOINT,
      userinfo: process.env.AUTH_USER_INFO_ENDPOINT,
    },
    issuer: process.env.AUTH_ISSUER,
    jwksUrl: process.env.AUTH_JWKS_URL,
    openIdConfigurationUrl: process.env.AUTH_OPENID_CONFIGURATION_URL,
    scope: process.env.AUTH_SCOPE,
    storeUserInSessionStorage: true,
  },
};
