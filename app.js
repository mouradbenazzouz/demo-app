
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
    issuer: "saml-demo-app",
    cert: `-----BEGIN CERTIFICATE-----
MIICqTCCAZECBgGdapQJUzANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1zYW1sLWRlbW8tYXBwMB4XDTI2MDQwODAwNTExOVoXDTM2MDQwODAwNTI1OVowGDEWMBQGA1UEAwwNc2FtbC1kZW1vLWFwcDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKyfun7dYbChbfTPU1C6cCscMY0QEnpsxvkOv/V2fwq5TcwQAUH/OoMQ1QNvRZBJzpO6FnB+9jTDhkm9//vsRgHds3fnSFz3OFkuZPmWjum8Xonpx/cJ9iWL/+ngf6A0mMzC2wGl5op/VhgsLD7eJJw3ctQg3GiZKNHItD6dcsREMG2F9cok2iZ66EyniiioXt7vsP6NDM/1OtD53V5b4WnmbRmzGxsu6VfGGX4BxI/VQSpIsQ0Ue7cgRsk3DZU1NHxgZouNoRUFxkG7MLAx6nkX118AXV3anf9HAswmE8L20VIf6uXD6apyt6QG1MltWCCnZeNUYpMDiVt7+ShuyW8CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAmzt/HCHaxEWG+IEHwyhy5NE87wZOVytC9I7btm3u4Odr2gSYqeuMpU1ThDoxuheYPmlhYAliq+6rp4rXUkMgwBffg2c4+Xg6E8W3H5G5QdvcpEddt5S2KAPndMDNSFhEX7tuF2tcItuvsf8oCspotiBk2Dy2htHqi748D1RNnN1LtIho56ujx+Ei3BA6zVJdh8o5rdH4FWNrW0IxGi9dc64aQPY+dgqsmKo34tLKe8xhWt7EhiTXf1g3Cg0dOXFqQ5EVsW6lI9v8AtEmLDWE6AlsmXhozaKN0JrbjuXx2GT1O/dKzxpb20kEt/tWHSKDkUG6yfeak9XzLka4vsyYhw==
-----END CERTIFICATE-----`,
    forceAuthn: true,
    authnRequestBinding: 'HTTP-POST'
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
