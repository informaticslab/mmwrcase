var passport = require('passport'), bcrypt= require('bcrypt')
  LocalStrategy = require('passport-local').Strategy;
var db = require('../lib/dbConnection');

module.exports = function() {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(email, password, done) {
      db.query('select * from user where email = "' + email + '"' , function(err, rows) {
        //console.log(rows);
        //if(rows[0]  && password === rows[0].hash_password) {
        //var myhashed =
        user = {
          user_id : rows[0].user_id,
          email   : rows[0].email,
          hash_password : rows[0].hash_password,
          user_name : rows[0].user_name,
          first_name : rows[0].first_name,
          type       : rows[0].type
        }
        if(user && bcrypt.compareSync(password,user.hash_password)) {
          return done(null,user);
        }
        else {
          return done(null,false);
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    if(user){
      done(null, user);
    }
  });

  passport.deserializeUser(function(user, done) {
    console.log('session user', user)
    db.query("select * from user where user_id = "+user.user_id, function(err,rows) {
    user = rows[0];
      done(err, user);
    });
  });

}