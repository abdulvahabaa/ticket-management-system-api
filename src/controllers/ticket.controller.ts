import { Request, Response } from "express";
import TicketService from "../services/ticket.service";
import UsersService from "../services/users.service";

interface CustomRequest extends Request {
  user?: any;
}

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

  public getTicketById = async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      console.log(ticketId);
      const ticket = await this.ticketService.getTicketById(ticketId!);
      console.log(ticket);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const response = {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        type: ticket.type,
        venue: ticket.venue,
        status: ticket.status,
        price: ticket.price,
        priority: ticket.priority,
        dueDate: ticket.due_date,
        createdBy: ticket.created_by,
        assignedUsers: ticket.assigned_users || [],
      };
      return res.status(200).json(response);
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Something went wrong" });
    }
  };

  public assignUserToTicket = async (req: CustomRequest, res: Response) => {
    try {
      const { ticketId } = req.params;
      const { userId } = req.body;
      const creatorId = req.user.id;

      const authorization = req.headers.authorization;
      if (!authorization) {
        return res
          .status(401)
          .json({ message: "No authorization token provided" });
      }

      const ticket = await this.ticketService.getTicketById(ticketId!);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (!Array.isArray(ticket.assigned_users)) {
        ticket.assigned_users = [];
      }

      const user = await this.usersService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      if (
        ticket.assigned_users.some(
          (assignedUser: any) => assignedUser.userId == userId
        )
      ) {
        return res.status(400).json({ message: "User already assigned" });
      }

      if (ticket.status === "closed") {
        return res
          .status(400)
          .json({ message: "Cannot assign users to a closed ticket" });
      }

      if (ticket.assigned_users && ticket.assigned_users.length >= 5) {
        return res
          .status(400)
          .json({ message: "User assignment limit reached" });
      }

      if (ticket.created_by !== creatorId && user.type !== "admin") {
        return res
          .status(400)
          .json({ message: "User not authorized to assign ticket" });
      }

      const assignObject = {
        userId: user.id,
        name: user.name,
        email: user.email,
      };

      ticket.assigned_users.push(assignObject);

      await this.ticketService.updateTicket(ticketId!, ticket);

      return res.status(200).json({ message: "User assigned successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

  public ticketHistory = async (req: Request, res: Response) => {
    try {
      const result = await this.ticketService.ticketHistory();
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
}

export default TicketController;
