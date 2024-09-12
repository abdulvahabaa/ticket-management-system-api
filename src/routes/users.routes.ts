import express, { Request } from "express";

const usersRoutes = express.Router({ mergeParams: true });

usersRoutes.get("/", (req: Request) => {
    return req.body
})

export default usersRoutes;