import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      customerName,
      email,
      vehicleModel,
      vehicleNo,
      certificateNo,
    } = data;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email is required",
        },
        { status: 400 }
      );
    }

    if (!customerName || !vehicleNo) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer details are missing",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // GMAIL TRANSPORTER
    // ==========================================

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ==========================================
    // EMAIL #2
    // ==========================================

    await transporter.sendMail({
      from: `"Paint Shield India" <${process.env.GMAIL_USER}>`,

      to: email,

      subject:
        "Paint Shield India — Accidental Warranty Processing Update",

      text: `Dear ${customerName},

Greetings from Paint Shield India.

We would like to inform you that your 1-Year Accidental Warranty Certificate is currently being processed.

Your accidental warranty certificate will be shared with you shortly.

Warranty Certificate No.: ${certificateNo || "—"}
Vehicle: ${vehicleModel || "—"}
Registration No.: ${vehicleNo}

Please keep this email for your records.

For any assistance, please contact:

Paint Shield India
Phone: +91 6367629112
Email: info@paintshieldindia.com

Thank you for choosing Paint Shield India.

Warm regards,
Team Paint Shield India`,

      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #222;
            max-width: 650px;
            margin: auto;
          "
        >

          <h2 style="color:#b8860b;">
            Paint Shield India
          </h2>

          <p>
            Dear <strong>${customerName}</strong>,
          </p>

          <p>
            Greetings from Paint Shield India.
          </p>

          <p>
            We would like to inform you that your
            <strong>1-Year Accidental Warranty Certificate</strong>
            is currently being processed.
          </p>

          <div
            style="
              background:#fbf6e7;
              border:1px solid #e6c764;
              padding:18px;
              margin:20px 0;
            "
          >

            <p style="margin:5px 0;">
              <strong>Warranty Certificate No:</strong>
              ${certificateNo || "—"}
            </p>

            <p style="margin:5px 0;">
              <strong>Vehicle:</strong>
              ${vehicleModel || "—"}
            </p>

            <p style="margin:5px 0;">
              <strong>Registration No:</strong>
              ${vehicleNo}
            </p>

            <p style="margin:5px 0;">
              <strong>Accidental Warranty:</strong>
              1 Year
            </p>

            <p style="margin:5px 0;">
              <strong>Status:</strong>
              Processing
            </p>

          </div>

          <p>
            Your accidental warranty certificate will be
            <strong>shared with you shortly</strong>.
          </p>

          <p>
            Please keep this email for your records.
          </p>

          <p>
            For any assistance, please contact us:
          </p>

          <p>
            <strong>Paint Shield India</strong><br/>
            📞 +91 6367629112<br/>
            📧 info@paintshieldindia.com
          </p>

          <p>
            Thank you for choosing Paint Shield India.
          </p>

          <p>
            Warm regards,<br/>
            <strong>Team Paint Shield India</strong>
          </p>

        </div>
      `,
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      message:
        "Accidental warranty processing email sent successfully.",
    });
  } catch (error) {
    console.error(
      "ACCIDENTAL PROCESS EMAIL ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send accidental warranty processing email.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}