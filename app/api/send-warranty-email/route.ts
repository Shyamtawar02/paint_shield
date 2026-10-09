import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { getWarrantyCertificateHtml } from "@/lib/warrantyCertificate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let browser;

  try {
    const data = await req.json();

    const {
      certificateNo,
      issuedFmt,
      customerName,
      vehicleModel,
      vehicleNo,
      studio,
      contactNo,
      email,
      serviceType,
      serviceDateFmt,
      warrantyNum,
      endDateFmt,
      yearsLeft,
    } = data;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email is required",
        },
        { status: 400 }
      );
    }

    if (!certificateNo || !vehicleNo || !customerName) {
      return NextResponse.json(
        {
          success: false,
          message: "Required warranty details are missing",
        },
        { status: 400 }
      );
    }

    // Create warranty certificate HTML
    const html = getWarrantyCertificateHtml({
      certificateNo,
      issuedFmt,
      customerName,
      vehicleModel: vehicleModel || "",
      vehicleNo,
      studio: studio || "",
      contactNo: contactNo || "",
      email,
      serviceType: serviceType || "",
      serviceDateFmt,
      warrantyNum,
      endDateFmt,
      yearsLeft,
    });

    // Start Puppeteer
   browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: true,
});

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    // Generate A4 PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "14mm",
        right: "14mm",
        bottom: "14mm",
        left: "14mm",
      },
    });

    await browser.close();
    browser = undefined;

    
console.log("GMAIL CONFIG CHECK:", {
  userExists: Boolean(process.env.GMAIL_USER),
  passwordExists: Boolean(process.env.GMAIL_APP_PASSWORD),
});

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Paint Shield India" <${process.env.GMAIL_USER}>`,
      to: email,

      subject: `Paint Shield India — Warranty Certificate ${certificateNo}`,

      text: `Dear ${customerName},

Greetings from Paint Shield India.

Please find attached your official Paint Shield India Digital Warranty Certificate.

Warranty Certificate No.: ${certificateNo}
Vehicle: ${vehicleModel || "—"}
Registration No.: ${vehicleNo}
Warranty Period: ${warrantyNum} Years
Valid Until: ${endDateFmt}

Please retain this email and attached certificate for your records.

For warranty assistance:
Phone: +91 6367629112
Email: info@paintshieldindia.com

Thank you for choosing Paint Shield India.

Warm regards,
Team Paint Shield India`,

      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#222;max-width:650px;margin:auto;">

          <h2 style="color:#b8860b;">
            Paint Shield India
          </h2>

          <p>Dear <strong>${customerName}</strong>,</p>

          <p>
            Greetings from Paint Shield India.
          </p>

          <p>
            Please find attached your official
            <strong>Paint Shield India Digital Warranty Certificate</strong>.
          </p>

          <div style="
            background:#fbf6e7;
            border:1px solid #e6c764;
            padding:18px;
            margin:20px 0;
          ">

            <p style="margin:5px 0;">
              <strong>Certificate No:</strong> ${certificateNo}
            </p>

            <p style="margin:5px 0;">
              <strong>Vehicle:</strong> ${vehicleModel || "—"}
            </p>

            <p style="margin:5px 0;">
              <strong>Registration No:</strong> ${vehicleNo}
            </p>

            <p style="margin:5px 0;">
              <strong>Warranty Period:</strong> ${warrantyNum} Years
            </p>

            <p style="margin:5px 0;">
              <strong>Valid Until:</strong> ${endDateFmt}
            </p>

          </div>

          <p>
            Please retain this email and the attached certificate
            for your records.
          </p>

          <p>
            For warranty assistance or claim-related queries,
            please contact us:
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
          filename: `paintshield-warranty-${vehicleNo}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Warranty certificate email sent successfully",
    });
  } catch (error) {
    console.error("WARRANTY EMAIL ERROR:", error);

    if (browser) {
      try {
        await browser.close();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send warranty email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}