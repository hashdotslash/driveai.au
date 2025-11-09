import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendEmail } from "@/lib/ses";
import { tplEnquirySeller, tplEnquiryBuyer } from "@/lib/emailTemplates";
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let body: any = {};
  if (contentType.includes("application/json")) body = await req.json();
  else if (contentType.includes("application/x-www-form-urlencoded")) { const form = await req.formData(); body = Object.fromEntries(form.entries()); }
  const { vehicleId, buyerEmail, message } = body;
  if (!vehicleId || !buyerEmail || !message) return new Response("Missing fields", { status: 400 });
  const e = await prisma.enquiry.create({ data: { vehicleId, buyerEmail, message } });
  try {
    const v = await prisma.vehicle.findUnique({ where: { id: vehicleId }, include: { seller: true } });
    if (v?.seller?.email) await sendEmail(v.seller.email, `New enquiry for ${v.title}`, tplEnquirySeller({ title: v.title, buyerEmail, message, link: `${process.env.NEXTAUTH_URL||''}/vehicles/${v.id}` }));
    await sendEmail(buyerEmail, `Your enquiry was sent`, tplEnquiryBuyer({ title: v?.title||'', link: `${process.env.NEXTAUTH_URL||''}/vehicles/${v?.id||''}` }));
  } catch {}
  return Response.json(e, { status: 201 });
}
