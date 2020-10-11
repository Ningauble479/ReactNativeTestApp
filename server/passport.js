var passport = require("passport");
import { GraphQLLocalStrategy } from 'graphql-passport';
import bcrypt from 'bcrypt'

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
const initPassport = ({User}) =>{
passport.use(new GraphQLLocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  (email, password, done) => {
    console.log('ur here')
    console.log(email)
    // When a user tries to sign in this code runs
    User.findOne({email: email}).then( async (dbusers)=> {
      // If there's no user with the given email
      
      if (!dbusers) {
          console.log('1')
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else {
        const match = await bcrypt.compare(password, dbusers.password)
          if(match === true){
            console.log({LoggingIn: dbusers})
            done(null, dbusers);
            return
          }
          else {
            console.log('2')
            return done(null, false, {
            message: "Incorrect password."
          })}
    
      }
      // If none of the above, return the user
      
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

}
// Exporting our configured passport
export default initPassport;