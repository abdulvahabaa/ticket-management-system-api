import { Request, Response, NextFunction } from "express";
import UsersService from "../services/users.service";

class UsersController {
  public usersService = new UsersService();
  public createUser = async (req: Request, res: Response) => {
    try {
      const userData: any = req.body;
      const data = await this.usersService.createUser(userData);

      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(error.status ?? 500)
        .json({ message: error.message ?? "Something went wrong" });
    }
  };
}

export default UsersController;
