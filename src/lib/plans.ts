export const memberPlans = [
  { name: "Hour Pass", price: "€3", unit: "/ h", amount: 3, type: "pass" as const, includes: "Book any hotdesk", perks: ["First espresso free"], highlight: false },
  { name: "Day Pass", price: "€20", unit: "/ day", amount: 20, type: "pass" as const, includes: "8 h desk + 2 h meeting room", perks: ["BVG day-ticket 50% off"], highlight: false },
  { name: "FlexPass 40", price: "€179", unit: "/ mo", amount: 179, type: "membership" as const, includes: "40 credits (1 h = 1, 1 day = 8)", perks: ["Gym 2× / mo", "Member events"], highlight: true },
  { name: "Infinity", price: "€349", unit: "/ mo", amount: 349, type: "membership" as const, includes: "Unlimited desks, 10 h meeting rooms", perks: ["Locker", "Premium perks"], highlight: false },
];

export const operatorPlans = [
  { name: "Starter", price: "Free", commission: "10%", seats: "≤ 25", features: ["Microsite", "Basic bookings"] },
  { name: "Growth", price: "€79", commission: "7%", seats: "≤ 100", features: ["Dynamic pricing", "Analytics", "API"] },
  { name: "Pro", price: "€199", commission: "5%", seats: "Unlimited", features: ["White-label", "CRM", "Kiosk", "Priority support"] },
  { name: "Enterprise", price: "Custom", commission: "3%", seats: "Unlimited", features: ["Multi-location", "SLA", "Custom integrations"] },
];
