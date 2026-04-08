
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const app = express();

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new SamlStrategy({
    path: "/login/callback",
    entryPoint: "http://sso.lab.example.com:8080/realms/rhtraining/protocol/saml",
    issuer: "saml-demo-app",
    cert: ""
  },
  function(profile, done) {
    return done(null, profile);
  }
));

app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send("Authenticated via SAML\n" + JSON.stringify(req.user, null, 2));
});

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/' })
);

app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.listen(3000, () => {
  console.log("App running on http://sso.lab.example.com:3000");
});
