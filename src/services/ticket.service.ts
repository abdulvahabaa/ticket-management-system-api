import pool from "../db/connection";

class TicketService {
  public async createTicket(data: any): Promise<any> {
    const { title, description, type, venue, status, price, priority, dueDate, createdBy } = data;

    try {
      const result = await pool.query(
        `INSERT INTO tickets (title, description, type, venue, status, price, priority, due_date, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [title, description, type, venue, status, price, priority, dueDate, createdBy]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default TicketService;
