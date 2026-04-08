
SAML Demo App

Install:
npm install express passport passport-saml express-session

Run:
npm start

Access:
http://sso.lab.example.com:3000

Keycloak (RHSSO) config:
Client ID: saml-demo-app
Protocol: saml
Assertion Consumer URL:
http://sso.lab.example.com:3000/login/callback
