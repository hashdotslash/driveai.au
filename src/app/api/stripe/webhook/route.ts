import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/ses";
import { tplAdminPayment, tplAdminListing } from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!secret) return new Response("Missing webhook secret", { status: 500 });
  const body = await req.text();
  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err:any) { return new Response(`Webhook Error: ${err.message}`, { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = (session.metadata && (session.metadata as any).email) || session.customer_details?.email;
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const admin = process.env.ADMIN_EMAIL;
        await prisma.user.update({ where: { id: user.id }, data: { credits: { increment: 1 } } });
        if (admin) { await sendEmail(admin, "Payment received", tplAdminPayment({ email, credits: 1 })); }
        const pending = await prisma.vehicle.findFirst({ where: { sellerId: user.id, status: "PENDING" }, orderBy:{ createdAt: "asc" } });
        if (pending) {
          await prisma.$transaction([
            prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } }),
            prisma.vehicle.update({ where: { id: pending.id }, data: { status: "ACTIVE" } })
          ]);
          if (admin) { await sendEmail(admin, "Listing auto-approved", tplAdminListing({ title: pending.title, id: pending.id, status: 'ACTIVE', link: `${process.env.NEXTAUTH_URL||''}/vehicles/${pending.id}` })); }
        }
      }
    }
  }
  return new Response("ok", { status: 200 });
}
