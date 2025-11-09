const { PrismaClient } = require("@prisma/client"); const prisma = new PrismaClient();
async function main() {
  const seller = await prisma.user.upsert({ where: { email: "dealer@ev.com" }, create: { email: "dealer@ev.com", name: "EV Dealer", role: "SELLER" }, update: {} });
  const existing = await prisma.vehicle.findFirst(); if (existing) { console.log("Vehicles already seeded."); return; }
  await prisma.vehicle.create({ data: { sellerId: seller.id, title: "2022 Tesla Model 3 Long Range", make: "Tesla", model: "Model 3", year: 2022, price: 68990, condition: "Used", location: "Sydney NSW", odometerKm: 22000, batteryKWh: 75, estRangeKm: 580, chargerType: "Type 2 CCS", description: "Well maintained, Autopilot, premium interior.", status: "ACTIVE", photos: { create: [{ url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d" }] } } });
  await prisma.vehicle.create({ data: { sellerId: seller.id, title: "2023 BYD Atto 3 Extended", make: "BYD", model: "Atto 3", year: 2023, price: 48990, condition: "New", location: "Melbourne VIC", odometerKm: 25, batteryKWh: 60, estRangeKm: 420, chargerType: "Type 2 CCS", description: "Brand new, ready for delivery.", status: "ACTIVE", photos: { create: [{ url: "https://images.unsplash.com/photo-1542362567-b07e54358753" }] } } });
  console.log("Seed complete.");
}
main().finally(()=>prisma.$disconnect());
