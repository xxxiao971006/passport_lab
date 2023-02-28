import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

declare global {
  namespace Express {
    interface User {
      id?: number | undefined;
      name: string;
      email: string;
      password: string;
      role: string;
    }
  }
}

const localStrategy = new LocalStrategy(
  {
    usernameField: "email", // same name attribute in ejs
    passwordField: "password",
  },
  (email, password, done) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);
      return user
        ? done(null, user)
        : done(null, false, {
            message: "Your login details are not valid. Please try again",
          });
  } catch(error: any) {
    done(null, false, {
      message: `Couldn't find user with email: ${email}`
    })
  }
}
);

/*
FIX ME (types) 😭
*/

passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/

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
