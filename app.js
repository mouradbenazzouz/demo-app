
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const app = express();

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

passport.use(new SamlStrategy({
    path: "/login/callback",
    entryPoint: "https://sso.lab.example.com:8443/realms/rhtraining/protocol/saml",
    callbackUrl: "http://workstation.lab.example.com:3000/login/callback",
    issuer: "saml-demo-app",
    cert: `-----BEGIN CERTIFICATE-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrVrCuTtArbgaZzL1hvh0xtL5mc7o0NqPVnYXkLvgcwiC3BjLGw1tGEGoJaXDuSaRllobm53JBhjx33UNv+5z/UMG4kytBWxheNVKnL6GgqlNabMaFfPLPCF8kAgKnsi79NMo+n6KnSY8YeUmec/p2vjO2NjsSAVcWEQMVhJ31LwIDAQAB
-----END CERTIFICATE-----`,
    forceAuthn: true
  },
  function(profile, done) {
    return done(null, profile);
  }
));

app.get('/', function(req, res) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
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

app.listen(3000, function() {
  console.log("App running on http://workstation.lab.example.com:3000");
});
