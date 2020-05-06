export interface Config {
  auth: {
    clientId: string;
    domain: string;
    audience: string;
    scope: string;
  };
}

export const getConfig = () => {
  return {
    auth: {
      clientId: "8JsLGr5g44aTnXwcN60lAcc1QdO4BT2i",
      domain: "enzsft.eu.auth0.com",
      audience: "https://auth-examples-api",
      scope: "openid profile email",
    },
  };
};
