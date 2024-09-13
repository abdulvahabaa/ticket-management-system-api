import { Request, Response, NextFunction } from "express";
import DashboardService from "../services/dashboard.service";

class DashboardController {
  private dashboardService = new DashboardService();

  public ticketAnalytics = async (req: Request, res: Response,) => {
    console.log("test")
    try {

      const data = await this.dashboardService.ticketAnalytics()

      res.status(200).json(data);
    
    } catch (error) {

    }
  };
}

export default DashboardController;
