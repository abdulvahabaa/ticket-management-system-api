import pool from "../db/connection";

class TicketService {
  public async createTicket(data: any): Promise<any> {
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
    } = data;

    try {
      const result = await pool.query(
        `INSERT INTO tickets (title, description, type, venue, status, price, priority, due_date, created_by, assigned_users) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          title,
          description,
          type,
          venue,
          status,
          price,
          priority,
          dueDate,
          createdBy,
          [],
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async getTicketById(id: string): Promise<any> {
    try {
      const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async updateTicket(id: string, data: any): Promise<any> {
    console.log("Data received:", id, data);

    const { assigned_users } = data;

    // Ensure assigned_users is valid JSON or an empty array
    const users = assigned_users ? JSON.stringify(assigned_users) : "[]";
    console.log("Assigned users JSON:", users);

    try {
      const result = await pool.query(
        `UPDATE tickets SET assigned_users = $1 WHERE id = $2 RETURNING *`,
        [users, id]
      );

      console.log("Update result:", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw new Error((error as Error).message);
    }
  }
}

export default TicketService;
