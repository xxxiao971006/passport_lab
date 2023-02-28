import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

declare module 'express-session' {
  export interface SessionData {
    activeSessions: string[]
  }
}


router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const userRole = req.user?.role;
  res.render("dashboard", {
    user: req.user,
    userRole: userRole
  });
});

router.get("/dashboard/admin", ensureAuthenticated, (req, res) => {
  const currentSessionId = req.session.id;
  const store = (req.sessionStore as any).sessions;
  const activeSessions = Object.keys(store)
  console.log(activeSessions);
  
  res.render("admin", { user: req.user, currentSessionId: currentSessionId, activeSessions: activeSessions })
})


router.post("/revoke", ensureAuthenticated, (req, res) => {
  if(req.body.revoke) {
    const revokeSessionId = req.body.revoke;

    req.sessionStore.destroy(revokeSessionId, (err) => {
      // callback function. If an error occurs, it will be accessible here.
      if (err) {
        return console.error(err)
      }
      console.log("The session has been destroyed!")
    });
  }
  res.redirect('back')
})

export default router;
