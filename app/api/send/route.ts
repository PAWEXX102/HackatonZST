import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  console.log("RESEND_API_KEY:", apiKey); // Sprawdzenie klucza API

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "RESEND_API_KEY is not set" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  console.log("Using RESEND_API_KEY:", apiKey);

  try {
    const { to, subject, html } = await request.json();

    const response = await resend.emails.send({
      from: "P4W3XX <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Resend response:", response);

    return NextResponse.json({ data: response });
  } catch (e: any) {
    console.error("Error sending email:", e);
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
