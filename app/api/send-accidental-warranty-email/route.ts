import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { getAccidentalWarrantyCertificateHtml } from "@/lib/accidentalWarrantyCertificate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let browser;

  try {
    const data = await req.json();

    const {
      customerName,
      email,
      vehicleModel,
      vehicleNo,
      certificateNo,
      serviceDate,
    } = data;

    // ==============================
    // VALIDATION
    // ==============================

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email is required",
        },
        { status: 400 }
      );
    }

    if (!customerName || !vehicleNo || !certificateNo) {
      return NextResponse.json(
        {
          success: false,
          message: "Required customer details are missing",
        },
        { status: 400 }
      );
    }

    // ==============================
    // DATE FORMAT
    // ==============================

    const installationDate = serviceDate
      ? new Date(serviceDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

    // ==============================
    // ACCIDENTAL WARRANTY HTML
    // ==============================

    const html = getAccidentalWarrantyCertificateHtml({
      customerName,
      vehicle: vehicleModel || "",
      registrationNo: vehicleNo,
      vin: "",
      installationDate,
      certificateNo,
    });

    // ==============================
    // PUPPETEER
    // ==============================

  browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: true,
});

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    // ==============================
    // GENERATE PDF 
    // ==============================

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    await browser.close();
    browser = undefined;

    // ==============================
    // GMAIL TRANSPORTER
    // ==============================

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ==============================
    // EMAIL #3
    // ==============================

    await transporter.sendMail({
      from: `"Paint Shield India" <${process.env.GMAIL_USER}>`,

      to: email,

      subject:
        `Paint Shield India — 1-Year Accidental Warranty Certificate ${certificateNo}`,

      text: `Dear ${customerName},

Greetings from Paint Shield India.

We are pleased to share your official 1-Year Accidental Warranty Certificate.

Certificate No.: ${certificateNo}
Vehicle: ${vehicleModel || "—"}
Registration No.: ${vehicleNo}
Installation Date: ${installationDate}

Please find the Accidental Warranty Certificate attached with this email.

The certificate covers eligible accidental damage to the installed PPF, subject to inspection, verification and approval by Paint Shield India.

Please retain this certificate for your records.

For warranty assistance:

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
            We are pleased to share your official
            <strong>1-Year Accidental Warranty Certificate</strong>.
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
              <strong>Certificate No:</strong>
              ${certificateNo}
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
              <strong>Installation Date:</strong>
              ${installationDate}
            </p>

            <p style="margin:5px 0;">
              <strong>Accidental Warranty:</strong>
              1 Year
            </p>

          </div>

          <p>
            Please find the
            <strong>Accidental Warranty Certificate PDF</strong>
            attached with this email.
          </p>

          <p>
            The certificate covers eligible accidental damage to the
            installed PPF, subject to inspection, verification and
            approval by Paint Shield India.
          </p>

          <p>
            Please retain this certificate for your records.
          </p>

          <p>
            For warranty assistance or claim-related queries:
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

      attachments: [
        {
          filename: `paintshield-accidental-warranty-${vehicleNo}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message:
        "Accidental warranty certificate email sent successfully.",
    });

  } catch (error) {
    console.error(
      "ACCIDENTAL WARRANTY EMAIL ERROR:",
      error
    );

    if (browser) {
      try {
        await browser.close();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send accidental warranty certificate email.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}