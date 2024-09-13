import express from "express";
import DashboardController from "../controllers/dashboard.controller";

const dashboardRoutes = express.Router();
const dashboardController = new DashboardController();

dashboardRoutes.get("/analytics", dashboardController.ticketAnalytics);

export default dashboardRoutes;