import express from "express";
/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (req: express.Request, res: express.Response, next: (err ?:any) => void ) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: express.Request, res: express.Response, next: (err?: any) => void) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}