import express, { Request } from "express";

const ticketRoutes = express.Router({ mergeParams: true });

ticketRoutes.get("/", (req: Request) => {
    return req.body
})

export default ticketRoutes;