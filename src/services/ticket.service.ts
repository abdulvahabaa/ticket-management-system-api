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
    const { assigned_users } = data;

    const users = assigned_users ? JSON.stringify(assigned_users) : "[]";

    try {
      const result = await pool.query(
        `UPDATE tickets SET assigned_users = $1 WHERE id = $2 RETURNING *`,
        [users, id]
      );

      // console.log("Update result:", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw new Error((error as Error).message);
    }
  }

  public async ticketHistory(query: {
    startDate?: string;
    endDate?: string;
    status?: string;
    priority?: string;
    type?: string;
    venue?: string;
  }): Promise<any> {
    try {
      let baseQuery = `
        SELECT 
          COUNT(*) AS total_tickets,
          COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_tickets,
          COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_tickets,
          COUNT(CASE WHEN status = 'in-progress' THEN 1 END) AS in_progress_tickets,
          COUNT(CASE WHEN priority = 'low' THEN 1 END) AS low_priority,
          COUNT(CASE WHEN priority = 'medium' THEN 1 END) AS medium_priority,
          COUNT(CASE WHEN priority = 'high' THEN 1 END) AS high_priority,
          COUNT(CASE WHEN type = 'concert' THEN 1 END) AS concert_tickets,
          COUNT(CASE WHEN type = 'conference' THEN 1 END) AS conference_tickets,
          COUNT(CASE WHEN type = 'sports' THEN 1 END) AS sports_tickets
        FROM tickets
      `;

      let filterConditions: string[] = [];

      if (query.startDate) {
        filterConditions.push(`created_at >= '${query.startDate}'`);
      }
      if (query.endDate) {
        filterConditions.push(`created_at <= '${query.endDate}'`);
      }
      if (query.status) {
        filterConditions.push(`status = '${query.status}'`);
      }
      if (query.priority) {
        filterConditions.push(`priority = '${query.priority}'`);
      }
      if (query.type) {
        filterConditions.push(`type = '${query.type}'`);
      }
      if (query.venue) {
        filterConditions.push(`venue = '${query.venue}'`);
      }

      if (filterConditions.length > 0) {
        baseQuery += ` WHERE ${filterConditions.join(" AND ")}`;
      }

      const result = await pool.query(baseQuery);

      let ticketsQuery = `
        SELECT 
          id,
          title,
          status,
          priority,
          type,
          venue,
          created_at AS "createdDate",
          created_by AS "createdBy"
        FROM tickets
      `;

      if (filterConditions.length > 0) {
        ticketsQuery += ` WHERE ${filterConditions.join(" AND ")}`;
      }

      const ticketsResult = await pool.query(ticketsQuery);

      const {
        total_tickets,
        closed_tickets,
        open_tickets,
        in_progress_tickets,
        low_priority,
        medium_priority,
        high_priority,
        concert_tickets,
        conference_tickets,
        sports_tickets,
      } = result.rows[0];

      const analyticsData = {
        totalTickets: parseInt(total_tickets, 10),
        closedTickets: parseInt(closed_tickets, 10),
        openTickets: parseInt(open_tickets, 10),
        inProgressTickets: parseInt(in_progress_tickets, 10),
        priorityDistribution: {
          low: parseInt(low_priority, 10),
          medium: parseInt(medium_priority, 10),
          high: parseInt(high_priority, 10),
        },
        typeDistribution: {
          concert: parseInt(concert_tickets, 10),
          conference: parseInt(conference_tickets, 10),
          sports: parseInt(sports_tickets, 10),
        },
        tickets: ticketsResult.rows.map((ticket: any) => ({
          id: ticket.id,
          title: ticket.title,
          status: ticket.status,
          priority: ticket.priority,
          type: ticket.type,
          venue: ticket.venue,
          createdDate: ticket.createdDate,
          createdBy: ticket.createdBy,
        })),
      };

      console.log(analyticsData);

      return analyticsData;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch ticket history: ${(error as Error).message}`
      );
    }
  }
}

export default TicketService;
