import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';


const localStrategy = new LocalStrategy(
  {
    usernameField: "email", // same name attribute in ejs
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

/*
FIX ME (types) 😭
*/

// passport.serializeUser(function (user: any, done: any) {
//   done(null, user.id);
// });

declare global {
  namespace Express {
    interface User {
      id?: number | undefined;
      name: string; 
      email: string;
      password: string
    }
  }
}

passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/
// passport.deserializeUser(function (id: number, done) {
//   let user = getUserById(id);
//   if (user) {
//     done(null, user);
//   } else {
//     done({ message: "User not found" }, null);
//   }
// });

passport.deserializeUser(function (id: number, done: (err: any, user?: Express.User | null | false) => void) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
