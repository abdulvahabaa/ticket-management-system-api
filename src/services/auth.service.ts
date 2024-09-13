import pool from "../db/connection";
import bcrypt from "bcrypt";
import jwt, { Jwt } from "jsonwebtoken";

interface User {
  id: number;
  email: string;
  password: string;
}
class AuthService {
  public async login(email: string, password: string): Promise<User> {
    try {
      const result = await pool.query(
        "SELECT * FROM public.users WHERE email = $1",
        [email]
      );
      const user = result.rows[0];

      if (!user) {
        throw new Error("User does not exist.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials.");
      }

      return user;
    } catch (error:unknown) {
      throw new Error(error instanceof Error ? error.message : "Login error");
    }
  }

  public async generateToken(user: any): Promise<string> {
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "5h",
    });
    return token;
  }
}

export default AuthService;
