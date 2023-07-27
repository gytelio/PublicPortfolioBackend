import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isAuthenticatedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN!, (err: any, _user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

export default isAuthenticatedMiddleware;
