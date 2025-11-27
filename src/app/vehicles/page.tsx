import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function VehiclesPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const make = searchParams.make;
  const chargerType = searchParams.chargerType;
  const minRange = searchParams.minRange ? parseInt(searchParams.minRange) : undefined;
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined;
  const sort = searchParams.sort || "newest";
  const where: any = { status: "ACTIVE" };
  if (make) where.make = { contains: make, mode: "insensitive" };
  if (chargerType) where.chargerType = { contains: chargerType, mode: "insensitive" };
  if (minRange) where.estRangeKm = { gte: minRange };
  if (minPrice || maxPrice) where.price = {}; if (minPrice) where.price.gte = minPrice; if (maxPrice) where.price.lte = maxPrice;
  const orderBy: Prisma.VehicleOrderByWithRelationInput =
    sort === "price-desc"
      ? { price: "desc" }
      : sort === "range-desc"
        ? { estRangeKm: "desc" }
        : { createdAt: "desc" };
  const vehicles = await prisma.vehicle.findMany({ where, orderBy, include: { photos: true } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Browse EVs</h1>
      <form className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
        <div><label className="text-xs">Make</label><input name="make" className="w-full border rounded px-3 py-2" defaultValue={make||""}/></div>
        <div><label className="text-xs">Charger</label><input name="chargerType" className="w-full border rounded px-3 py-2" defaultValue={chargerType||""}/></div>
        <div><label className="text-xs">Min range</label><input name="minRange" type="number" className="w-full border rounded px-3 py-2" defaultValue={searchParams.minRange||""}/></div>
        <div><label className="text-xs">Min price</label><input name="minPrice" type="number" className="w-full border rounded px-3 py-2" defaultValue={searchParams.minPrice||""}/></div>
        <div><label className="text-xs">Max price</label><input name="maxPrice" type="number" className="w-full border rounded px-3 py-2" defaultValue={searchParams.maxPrice||""}/></div>
        <div><label className="text-xs">Sort</label><select name="sort" className="w-full border rounded px-3 py-2" defaultValue={sort}><option value="newest">Newest</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="range-desc">Range ↓</option></select></div>
        <div className="md:col-span-6"><button className="btn border">Apply filters</button></div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map(v => (
          <Link key={v.id} href={`/vehicles/${v.id}`} className="card p-4 hover:shadow-lg transition">
            <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
              {v.photos[0]?.url ? <img src={v.photos[0].url} alt={v.title} className="w-full h-full object-cover rounded-lg"/> : "No photo"}
            </div>
            <div className="font-semibold">{v.title}</div>
            <div className="text-sm text-gray-600">{v.make} {v.model} • {v.year}</div>
            <div className="mt-1">${v.price.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Range: {v.estRangeKm} km • Battery: {v.batteryKWh} kWh</div>
          </Link>
        ))}
        {vehicles.length === 0 && <div className="text-gray-600">No vehicles found.</div>}
      </div>
    </div>
  )
}
