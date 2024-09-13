import express from "express";
import UsersController from "../controllers/users.controller";

const usersRoutes = express.Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.createUser);

export default usersRoutes;
