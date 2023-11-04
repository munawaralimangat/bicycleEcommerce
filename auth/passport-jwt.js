// const passport = require('passport');
// const passportJWT = require('passport-jwt');
// const User = require('./models/user'); // Assuming you have a user model

// const JwtStrategy = passportJWT.Strategy;
// const ExtractJwt = passportJWT.ExtractJwt;

// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: 'your-secret-key', // Change this to your own secret key
// };

// passport.use(
//   new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
//     try {
//       const user = await User.findById(jwtPayload.id);
//       if (!user) {
//         return done(null, false);
//       }
//       return done(null, user);
//     } catch (error) {
//       return done(error, false);
//     }
//   })
// );
