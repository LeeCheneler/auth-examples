export interface Config {
  auth: {
    authority: string;
    clientId: string;
    domain: string;
    audience: string;
    scope: string;
    openIdConfigurationUrl: string;
    issuer: string;
    jwksUrl: string;
    algorithms: string[];
    endpoints: {
      authorize: string;
      token: string;
      userinfo: string;
      logout: string;
      revoke: string;
      register: string;
    };
  };
}

export const getConfig = (): Config => {
  return {
    auth: {
      authority: "https://enzsft.eu.auth0.com",
      clientId: "8JsLGr5g44aTnXwcN60lAcc1QdO4BT2i",
      domain: "enzsft.eu.auth0.com",
      audience: "https://auth-examples-api",
      scope: "openid profile email",
      openIdConfigurationUrl:
        "https://enzsft.eu.auth0.com/.well-known/openid-configuration",
      issuer: "https://enzsft.eu.auth0.com/",
      jwksUrl: "https://enzsft.eu.auth0.com/.well-known/jwks.json",
      algorithms: ["RS256"],
      endpoints: {
        authorize: "https://enzsft.eu.auth0.com/authorize",
        token: "https://enzsft.eu.auth0.com/oauth/token",
        userinfo: "https://enzsft.eu.auth0.com/userinfo",
        logout: "https://enzsft.eu.auth0.com/logout",
        revoke: "https://enzsft.eu.auth0.com/oauth/revoke",
        register: "https://enzsft.eu.auth0.com/oidc/register",
      },
    },
  };
};
