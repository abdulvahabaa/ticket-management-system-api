import pool from "../db/connection";

class DashboardService {
  public async ticketAnalytics(): Promise<any> {
    
    try {
      const result = await pool.query(`
        WITH ticket_counts AS (
          SELECT 
            COUNT(*) AS total_tickets,
            COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_tickets,
            COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_tickets,
            COUNT(CASE WHEN status = 'in-progress' THEN 1 END) AS in_progress_tickets,
            ROUND(AVG(price), 0) AS average_customer_spending,
            COUNT(DISTINCT DATE(created_at)) AS total_days,
            
            -- Priority ticket counts
            COUNT(CASE WHEN priority = 'low' THEN 1 END) AS low_priority,
            COUNT(CASE WHEN priority = 'medium' THEN 1 END) AS medium_priority,
            COUNT(CASE WHEN priority = 'high' THEN 1 END) AS high_priority,
            
            -- Type ticket counts
            COUNT(CASE WHEN type = 'concert' THEN 1 END) AS concert_type,
            COUNT(CASE WHEN type = 'conference' THEN 1 END) AS conference_type,
            COUNT(CASE WHEN type = 'sports' THEN 1 END) AS sports_type,

            -- Average tickets per day for each priority level
            COUNT(CASE WHEN priority = 'low' THEN 1 END) / COUNT(DISTINCT DATE(created_at)) AS avg_low_priority_per_day,
            COUNT(CASE WHEN priority = 'medium' THEN 1 END) / COUNT(DISTINCT DATE(created_at)) AS avg_medium_priority_per_day,
            COUNT(CASE WHEN priority = 'high' THEN 1 END) / COUNT(DISTINCT DATE(created_at)) AS avg_high_priority_per_day
          FROM tickets
        )
        SELECT
          total_tickets,
          closed_tickets,
          open_tickets,
          in_progress_tickets,
          average_customer_spending,
          CASE 
            WHEN total_days > 0 THEN total_tickets / total_days
            ELSE 0
          END AS avg_tickets_per_day,
          low_priority,
          medium_priority,
          high_priority,
          avg_low_priority_per_day,
          avg_medium_priority_per_day,
          avg_high_priority_per_day,
          concert_type,
          conference_type,
          sports_type
        FROM ticket_counts;
      `);

      if (result.rows.length > 0) {
        const analytics = {
          totalTickets: result.rows[0].total_tickets,
          closedTickets: result.rows[0].closed_tickets,
          openTickets: result.rows[0].open_tickets,
          inProgressTickets: result.rows[0].in_progress_tickets,
          averageCustomerSpending: result.rows[0].average_customer_spending,
          averageTicketsBookedPerDay: result.rows[0].avg_tickets_per_day,
          priorityDistribution: {
            low: result.rows[0].low_priority,
            averageLowTicketsBookedPerDay: result.rows[0].avg_low_priority_per_day,
            medium: result.rows[0].medium_priority,
            averageMediumTicketsBookedPerDay: result.rows[0].avg_medium_priority_per_day,
            high: result.rows[0].high_priority,
            averageHighTicketsBookedPerDay: result.rows[0].avg_high_priority_per_day
          },
          typeDistribution: {
            concert: result.rows[0].concert_type,
            conference: result.rows[0].conference_type,
            sports: result.rows[0].sports_type,
          },
        };

        console.log("Analytics result:", analytics);
        return analytics;
      } else {
        console.log("No tickets found.");
        return {};
      }
    } catch (error: any) {
      console.error("Error occurred in ticket analytics:", error.message);
      throw new Error(`Failed to retrieve ticket analytics: ${(error as Error).message}`);
    }
  }
}

export default DashboardService;
