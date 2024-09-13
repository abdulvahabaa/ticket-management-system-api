import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const token = req.headers.authorization;
    // console.log("Authorization Header:", token); 

    if (!token) {
      return res.status(403).json({ message: "Access Token Denied" });
    }

    // Check for "Bearer " in the token
    if (token.startsWith("Bearer ")) {
      const extractedToken = token.split(" ")[1];
   

      try {
        const verified = jwt.verify(
          extractedToken as string,
          process.env.JWT_SECRET as string
        );

        console.log("Token Verified:", verified);
        next();
      } catch (err: any) {
        console.error("Token verification error:", err); 

        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Access Token Expired" });
        }
        return res.status(403).json({ message: "Invalid Token" });
      }
    } else {
      return res.status(403).json({ message: "Access Token Denied" });
    }
  } catch (err: any) {
    console.error("Error in verifyToken middleware:", err);

    res.status(500).json({ error: err.message });
  }
};
