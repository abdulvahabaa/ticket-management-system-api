const data = {
  totalTickets: 50,
  closedTickets: 30,
  openTickets: 15,
  inProgressTickets: 5,
  priorityDistribution: {
    low: 10,
    medium: 20,
    high: 20,
  },
  typeDistribution: {
    concert: 20,
    conference: 15,
    sports: 15,
  },
  tickets: [
    {
      id: "ticket_id_1",
      title: "Ticket Title 1",
      status: "closed",
      priority: "high",
      type: "concert",
      venue: "Venue 1",
      createdDate: "2024-07-01T18:00:00Z",
      createdBy: "user_id_1",
    },
    {
      id: "ticket_id_2",
      title: "Ticket Title 2",
      status: "in-progress",
      priority: "medium",
      type: "conference",
      venue: "Venue 2",
      createdDate: "2024-07-05T18:00:00Z",
      createdBy: "user_id_2",
    },
  ],
};

const Data2 = {
  totalTickets: 50,
  closedTickets: 30,
  openTickets: 15,
  averageCustomerSpending: 500, // The average of money that a single customer has spent in the given timespan
  AverageTicketsBookedPerDay: 100,
  inProgressTickets: 5,
  priorityDistribution: {
    low: 10,
    averageLowTicketsBookedPerDay: 1.2,
    medium: 20,
    averageMediumTicketsBookedPerDay: 2,
    high: 20,
    AverageHighTicketsBookedPerDay: 2,
  },
  typeDistribution: {
    concert: 20,
    conference: 15,
    sports: 15,
  },
};
