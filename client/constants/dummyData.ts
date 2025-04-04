export const dummy = [
  {
    _id: { $oid: "661c9b1e8c8e2f3a7c123456" },
    userId: { $oid: "661c9b1e8c8e2f3a7c987654" },
    week_id: 1,
    weekStart: "2025-03-24T00:00:00.000Z",
    weekEnd: "2025-03-30T23:59:59.000Z",

    totalSpent: 8750,

    topExpenses: [
      { category: "Dining", amount: 2400 },
      { category: "Shopping", amount: 2000 },
      { category: "Groceries", amount: 1600 },
    ],

    roundUpAmount: 320,
    totalSavings: 20000,

    goals: [
      {
        goalName: "Buy iPhone 15",
        progressThisWeek: 10000,
        progressPercentage: 83.3,
        status: "on track",
      },
      {
        goalName: "Vacation Trip",
        progressThisWeek: 3000,
        progressPercentage: 65.0,
        status: "behind",
      },
    ],

    totalInvestments: 7000,
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
      "You spent ₹8750 this week, with dining and shopping making up the largest portions. You're on track with your iPhone goal but need to boost savings for your vacation. Consider reducing discretionary spending next week to stay aligned with your targets.",
  },
];

export const weeks = [
  {
    weekStart: "2025-03-03",
    weekEnd: "2025-03-09",
    week_id: 1,
  },
  {
    weekStart: "2025-03-10",
    weekEnd: "2025-03-16",
    week_id: 2,
  },
  {
    weekStart: "2025-03-17",
    weekEnd: "2025-03-23",
    week_id: 3,
  },
  {
    weekStart: "2025-03-24",
    weekEnd: "2025-03-30",
    week_id: 4,
  },
];
