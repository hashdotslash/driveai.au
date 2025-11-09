import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const region = process.env.SES_REGION || process.env.AWS_REGION || "ap-southeast-2";
const client = new SESClient({
  region,
  credentials: process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.SES_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY as string
  } : undefined
});
export async function sendEmail(to: string, subject: string, html: string) {
  const from = process.env.FROM_EMAIL; if (!from) return;
  const cmd = new SendEmailCommand({ Destination: { ToAddresses: [to] }, Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }, Source: from });
  await client.send(cmd);
}
