import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";

class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await this.authService.login(email, password);

      const token = await this.authService.generateToken(user);

      return res.status(200).json({ message: "Login successful", token });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Something went wrong" });
    }
  };
}

export default AuthController;
