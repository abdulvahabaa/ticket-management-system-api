import { Request, Response } from "express";
import TicketService from "../services/ticket.service";
import UsersService from "../services/users.service";

class TicketController {
  public ticketService = new TicketService();
  public usersService = new UsersService();

  public createTicket = async (req: Request, res: Response) => {
    try {
      const requestData: any = req.body;
      const {
        title,
        description,
        type,
        venue,
        status,
        price,
        priority,
        dueDate,
        createdBy,
      } = requestData;

      if (
        !title ||
        !description ||
        !type ||
        !venue ||
        !price ||
        !priority ||
        !dueDate ||
        !createdBy
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const currentDate = new Date();
      const parsedDueDate = new Date(dueDate);
      if (parsedDueDate <= currentDate) {
        return res
          .status(400)
          .json({ message: "Due date must be a future date" });
      }

      const userExists = await this.usersService.getUserById(createdBy);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      const ticketData = await this.ticketService.createTicket(requestData);

      const response = {
        id: ticketData.id,
        title: ticketData.title,
        description: ticketData.description,
        type: ticketData.type,
        venue: ticketData.venue,
        status: ticketData.status,
        priority: ticketData.priority,
        dueDate: ticketData.due_date,
        createdBy: ticketData.created_by,
        assignedUsers: [],
      };

      return res.status(201).json(response);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Something went wrong" });
    }
  };
}

export default TicketController;
