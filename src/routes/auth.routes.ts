import express, { Request } from "express";

const authRoutes = express.Router({ mergeParams: true });

authRoutes.get("/", (req: Request) => {
    return req.body
})

export default authRoutes;