import express, { Request } from "express";

const dashboardRoutes = express.Router({ mergeParams: true });

dashboardRoutes.get("/", (req: Request) => {
    return req.body
})

export default dashboardRoutes;