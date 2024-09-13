import express from "express";
import TicketController from "../controllers/ticket.controller";
import { verifyToken } from "../middleware/authentication.middleware";

const ticketRoutes = express.Router();
const ticketController = new TicketController();

// ticketRoutes.post("/", verifyToken, ticketController.createTicket);
ticketRoutes.post("/", ticketController.createTicket);

export default ticketRoutes;
