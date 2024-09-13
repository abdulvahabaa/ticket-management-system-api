import bcrypt from "bcrypt";
import pool from "../db/connection";

class UsersService {
  public async createUser(data: {
    name: string;
    email: string;
    password: string;
    type: string;
  }): Promise<any> {
    const { name, email, password, type } = data;

    try {
      if (!name || !email || !password || !type) {
        return { error: "All fields are required" };
      }

      const emailExists = await pool.query(
        "SELECT 1 FROM public.users WHERE email = $1",
        [email]
      );

      if (emailExists?.rowCount && emailExists.rowCount > 0) {
        return { error: "User already exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO public.users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING id, name, email",
        [name, email, hashedPassword, type]
      );

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return { error: "An error occurred while creating the user" };
    }
  }

  public async getUserById(id: number): Promise<any> {
    try {
      const result = await pool.query(
        "SELECT * FROM public.users WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default UsersService;
