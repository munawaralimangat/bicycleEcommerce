const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// Load the User model
const Admin = require('../model/schema/adminSchema');

const loginCheck = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email',passwordField:'password' }, (email, password, done) => {
      // Check customer
      Admin.findOne({ email: email })
        .then((admin) => {
          if (!admin) {
            console.log('Wrong email');
            return done(null, false, { message: 'Wrong email' });
          }
          // Match Password - Compare the plain text password with the hashed password
          bcrypt.compare(password, admin.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              return done(null, admin);
            } else {
              console.log('Wrong password');
              return done(null, false, { message: 'Wrong password' });
            }
          });
        })
        .catch((error) => console.log(error));
    })
  );

  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser((id, done) => {
    Admin.findById(id)
      .then((admin) => {
        done(null, admin);
      })
      .catch((error) => {
        console.error(error);
        done(error);
      });
  });
};

module.exports = {
  loginCheck,
};
