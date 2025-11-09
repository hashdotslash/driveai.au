import Link from "next/link";
export default function Home() {
  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="text-3xl font-bold mb-2">Electric Car Trader Australia</h1>
        <p className="text-gray-700 mb-6 max-w-2xl">Australia’s EV-only marketplace. Search by battery size, range, and charger type. List your EV in minutes with our AI Listing Assistant.</p>
        <div className="flex gap-3">
          <Link href="/vehicles" className="btn btn-primary">Browse vehicles</Link>
          <Link href="/sell" className="btn border">Sell an EV</Link>
        </div>
      </section>
    </div>
  );
}
