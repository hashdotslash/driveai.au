export function tplLayout(title: string, bodyHtml: string) {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
  <body style="margin:0;padding:0;background:#f5f5f7;font-family:Arial,Helvetica,sans-serif;color:#0B0B0D;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px;">
  <table width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">
  <tr><td style="padding:16px 20px;border-bottom:1px solid #eee;"><span style="font-weight:700;font-size:18px;">Electric Car Trader Australia</span></td></tr>
  <tr><td style="padding:20px;">${bodyHtml}</td></tr>
  <tr><td style="padding:16px 20px;border-top:1px solid #eee;font-size:12px;color:#555;">Automated message.</td></tr>
  </table></td></tr></table></body></html>`;
}
export function tplEnquirySeller(opts:{title:string; buyerEmail:string; message:string; link:string}) {
  const body = `<h2 style="margin:0 0 12px">${opts.title}</h2><p>You received a new enquiry.</p>
  <p><strong>Buyer:</strong> ${opts.buyerEmail}</p><p><strong>Message:</strong></p>
  <blockquote style="margin:0;border-left:3px solid #007AFF;padding-left:12px;color:#333">${opts.message}</blockquote>
  <p style="margin-top:16px"><a href="${opts.link}" style="background:#007AFF;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;">View listing</a></p>`;
  return tplLayout("New enquiry received", body);
}
export function tplEnquiryBuyer(opts:{title:string; link:string}) {
  const body = `<p>Thanks — your enquiry was sent to the seller.</p><p>Listing: <strong>${opts.title}</strong></p><p><a href="${opts.link}" style="color:#007AFF">View the listing</a></p>`;
  return tplLayout("Your enquiry was sent", body);
}
export function tplAdminPayment(opts:{email:string; credits:number}) {
  return tplLayout("Payment received", `<p>Payment successful.</p><p><strong>User:</strong> ${opts.email}</p><p><strong>Credits added:</strong> ${opts.credits}</p>`);
}
export function tplAdminListing(opts:{title:string; id:string; status:string; link:string}) {
  return tplLayout("New listing", `<p>New listing submitted.</p><p><strong>Title:</strong> ${opts.title}</p><p><strong>Status:</strong> ${opts.status}</p><p><a href="${opts.link}" style="color:#007AFF">Open listing</a></p>`);
}
