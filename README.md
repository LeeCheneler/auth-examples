# auth-examples

Minimal server and web app implementations of auth approaches.

## Servers

The servers will have a protected endpoint `GET: /api/items` that returns items in the form of:

```
[
  { id: 1, title: "item 1" },
  { id: 2, title: "item 2" },
  { id: 3, title: "item 3" },
]
```

## Applications

The applications will have a basic structure consisting of 3 routes:

- `/` - public, shows login/logout button
  - if logged in then also shows links to profile and items
- `/profile` - protected, shows all user/token info
  - if not logged in then redirects to login and comes back
- `/items` - protected, shows all items loaded from server
  - if not logged in then redirects to login and comes back

## Implementations

|             | auth type | libs                     | Name                |
| ----------- | --------- | ------------------------ | ------------------- |
| Server      | JWT       | `express-jwt` `jwks-rsa` | server-jwt          |
| Application | JWT       | `@auth0/auth0-spa-js`    | app-jwt-auth0-react |
| Application | JWT       | `oidc-client-js`         | app-jwt-oidc-react  |

## Elements of authentication

### User login

- call login
- eventually lands at `/callback` (maybe use `/callback-signin`)
- obtain token
- check if there is a return url in local storage and redirect to it if there is

### User is already logged in

- obtain token silently on load
- if this fails then call login

### Log user out

- call logout
- clear all state
- eventually lands at `/callback` (maybe use `/callback-signout`)
