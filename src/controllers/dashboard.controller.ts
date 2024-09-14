import { Request, Response, NextFunction } from "express";
import DashboardService from "../services/dashboard.service";

class DashboardController {
  private dashboardService = new DashboardService();

  public ticketAnalytics = async (req: Request, res: Response) => {
    try {
      const data = await this.dashboardService.ticketAnalytics();

      res.status(200).json(data);
    } catch (error: any) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || "Something went wrong" });
    }
  };
}

export default DashboardController;
