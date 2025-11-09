import Stripe from "stripe";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
export async function POST(req: NextRequest) {
  try {
    const price = process.env.STRIPE_PRICE_ID_LISTING;
    if (!price) throw new Error("Missing STRIPE_PRICE_ID_LISTING");
    const sess = await auth(); if (!sess?.user?.email) throw new Error("Not signed in");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dealer`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: { email: String(sess.user.email) },
    });
    return Response.json({ url: session.url });
  } catch (e:any) { return new Response(e.message, { status: 500 }); }
}
