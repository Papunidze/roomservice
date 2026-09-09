import { env } from "../env.js";

interface Mail {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail(mail: Mail) {
  if (!env.RESEND_API_KEY) {
    console.log(`[mail] to ${mail.to}\n${mail.subject}\n${mail.text}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.MAIL_FROM, ...mail }),
  });

  if (!response.ok)
    throw new Error(`Mail provider responded ${response.status}`);
}
