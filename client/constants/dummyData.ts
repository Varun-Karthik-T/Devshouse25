export const dummy = [
  {
    _id: { $oid: "661c9b1e8c8e2f3a7c123456" },
    userId: { $oid: "661c9b1e8c8e2f3a7c987654" },
    month: 3,
    year: 2025,
    totalRoundUp: 320,
    totalSavings: 20000,
    totalSpent: 8750,
    totalInvestments: 7000,

    goals: [
      {
        goalName: "Buy iPhone 15",
        progressThisMonth: 10000,
        progressPercentage: 83.3,
        status: "on track",
      },
      {
        goalName: "Vacation Trip",
        progressThisMonth: 3000,
        progressPercentage: 65.0,
        status: "behind",
      },
    ],
    investments: [
      { type: "stocks", amount: 5000 },
      { type: "gold", amount: 2000 },
    ],

    transactions: [
      {
        transactionId: "txn001",
        date: "2025-03-24T12:35:00.000Z",
        category: "Dining",
        amount: 1200,
        notes: "Dinner at Barbeque Nation",
      },
      {
        transactionId: "txn002",
        date: "2025-03-25T15:40:00.000Z",
        category: "Shopping",
        amount: 2000,
        notes: "New shoes from Adidas",
      },
      {
        transactionId: "txn003",
        date: "2025-03-26T09:20:00.000Z",
        category: "Groceries",
        amount: 1600,
        notes: "Monthly groceries - BigBasket",
      },
      {
        transactionId: "txn004",
        date: "2025-03-27T18:00:00.000Z",
        category: "Dining",
        amount: 1200,
        notes: "Zomato weekend order",
      },
      {
        transactionId: "txn005",
        date: "2025-03-28T10:00:00.000Z",
        category: "Entertainment",
        amount: 950,
        notes: "Movie tickets + snacks",
      },
    ],

    aiSummary:
      "You spent ₹8750 this month, with dining and shopping making up the largest portions. You're on track with your iPhone goal but need to boost savings for your vacation. Consider reducing discretionary spending next month to stay aligned with your targets.",
  },
];

export const months = [
  {
    month: 3,
    year: 2025,
    month_id: 1,
  },
  {
    month: 4,
    year: 2025,
    month_id: 2,
  },
  {
    month: 5,
    year: 2025,
    month_id: 3,
  },
  {
    month: 6, 
    year: 2025,
    month_id: 4,
  },
];