import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Script from "next/script";

export default async function VehicleDetail({ params }: { params: { id: string }}) {
  const v = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { photos: true, seller: true } });
  if (!v || v.status === "PENDING") return notFound();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          {v.photos[0]?.url ? <img src={v.photos[0].url} alt={v.title} className="w-full h-full object-cover"/> : null}
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {v.photos.slice(1).map(p => (<img key={p.id} src={p.url} alt="photo" className="h-20 w-32 object-cover rounded-lg border"/>))}
        </div>
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{v.title}</h1>
        <div className="text-gray-700">{v.make} {v.model} • {v.year} • {v.location}</div>
        <div className="text-3xl font-semibold">${v.price.toLocaleString()}</div>
        <ul className="text-sm text-gray-700 grid grid-cols-2 gap-y-1">
          <li><strong>Battery:</strong> {v.batteryKWh} kWh</li>
          <li><strong>Range:</strong> {v.estRangeKm} km</li>
          <li><strong>Odometer:</strong> {v.odometerKm} km</li>
          <li><strong>Charger:</strong> {v.chargerType}</li>
        </ul>
        <p className="text-gray-700">{v.description}</p>
        <form action={`/api/enquiries`} method="post" className="bg-white border rounded-xl p-4 space-y-2">
          <input type="hidden" name="vehicleId" value={v.id} />
          <label className="block text-sm">Your email</label>
          <input name="buyerEmail" type="email" required className="w-full border rounded-lg px-3 py-2"/>
          <label className="block text-sm">Message</label>
          <textarea name="message" required className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Hi, is this still available?"></textarea>
          <button className="btn btn-primary">Send enquiry</button>
        </form>
        <Script id="ld-json" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"Product","name": v.title,"brand": v.make,"model": v.model,"description": v.description,"offers": {"@type":"Offer","priceCurrency":"AUD","price": v.price}})}}/>
      </div>
    </div>
  )
}
