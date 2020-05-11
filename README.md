# JWT Auth Example

An example application using JWT authentication to talk to a secure API.

## Getting started

Copy sample .env files, then make sure to fill them out with your auth providers details.

```sh
# Copy the server's .env file from the sample
cp packages/server/.env.sample packages/server/.env

# Copy the app's .env file from the sample
cp packages/app/.env.sample packages/app/.env
```

Install dependencies.

```sh
yarn
```

Run the server.

```sh
cd packages/server
yarn start
```

Run the app.

```sh
cd packages/app
yarn start
```

## Web app

The web app is a basic [React](https://reactjs.org/) application that uses the [oidc-client-js](https://github.com/IdentityModel/oidc-client-js/) to authenticate.

The web app consists of an empty home page, a profile page that dislpays infomation from the user's id token and an items page that displays items fetched from the server API using the user's access token.

## Server

The server is a basic [Node.js Express](https://expressjs.com/) that uses a combination of [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa) to secure it the API via JWT.

The server has a protected endpoint `GET: /api/items` that returns items in the form of:

```
[
  { id: 1, title: "item 1" },
  { id: 2, title: "item 2" },
  { id: 3, title: "item 3" },
]
```
