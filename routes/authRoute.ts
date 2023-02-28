import express from "express";
import passport from 'passport';
import { ensureAuthenticated, forwardAuthenticated } from "../middleware/checkAuth";
import session from "express-session";
import cookieParser from "cookie-parser";
// import { getUserRole , getUserByEmailIdAndPassword} from "../controllers/userController";

declare module 'express-session' {
  export interface SessionData {
    messages: { [key:string]:any}
 }
}

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const errorMsg = req.session.messages;
  req.session.messages = [];
  res.render("login", { message: errorMsg })
})

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
    /* FIX ME: 😭 failureMsg needed when login fails */
  },
  ),

), 
  

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  req.session.destroy((err) => {
    // callback function. If an error occurs, it will be accessible here.
    if (err) {
      return console.error(err)
    } 
  });
  res.clearCookie('connect.sid')
  res.redirect("/auth/login");
});


export default router;
