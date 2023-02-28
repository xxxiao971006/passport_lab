import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import passport from 'passport';
import { getUserById } from "../../controllers/userController";
import { database } from '../../models/userModel';

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

passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
    done(null, user.id);
});

passport.deserializeUser(function (id: number, done: (err: any, user?: Express.User | null | false) => void) {
    let user = getUserById(id);
    if (user) {
        done(null, user);
    } else {
        done({ message: "User not found" }, null);
    }
});

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    
    {
        clientID: "f2187bf0e81f9d37f843",
        clientSecret: "b0eb137030029d538dda6f952f7f08aa7679bec3",
        callbackURL: "http://localhost:8000/auth/github/callback", // where github hands in the user profile information
        passReqToCallback: true,

    },
    
    /* FIX ME 😭 */
    async function (req: any, accessToken: any, refreshToken: any, profile: any, done: any) {
        console.log(profile);
        database.push({
            id: Number([profile.id]),
            name: profile.username,
            email: "ABC@gmail.com",
            password: "ABC123!",
            role: "guest"
        },)
        let user = getUserById(Number(profile.id));
        if (user) {
            done(null, user);
        } else {
            done({ message: "User not found" }, null);
        }
        console.log(user)
    }    
);


const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;

