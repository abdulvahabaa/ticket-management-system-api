import express from "express";
import TicketController from "../controllers/ticket.controller";
import { verifyToken } from "../middleware/authentication.middleware";

const ticketRoutes = express.Router();
const ticketController = new TicketController();

ticketRoutes.post("/", verifyToken, ticketController.createTicket);

ticketRoutes.get("/analytics", verifyToken, ticketController.ticketHistory);

ticketRoutes.get("/:ticketId", verifyToken, ticketController.getTicketById);

ticketRoutes.post(
  "/:ticketId/assign",
  verifyToken,
  ticketController.assignUserToTicket
);

export default ticketRoutes;
