import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import { getAccidentalWarrantyCertificateHtml } from "@/lib/accidentalWarrantyCertificate";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    // ==========================================
    // CRON SECURITY
    // ==========================================

    const authHeader = request.headers.get("authorization");

    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // DATABASE
    // ==========================================

    await dbConnect();

    const db = mongoose.connection.useDb("paintshield");

    const now = new Date();

    const twentyFourHoursAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    );

    let processEmailsSent = 0;
    let accidentalEmailsSent = 0;

    // ==========================================
    // FIND CUSTOMERS
    // ==========================================

    const customers = await db
      .collection("customers")
      .find({
        email: { $exists: true, $ne: "" },

        warrantyEmailSentAt: {
          $exists: true,
          $ne: null,
        },
      })
      .toArray();

    // ==========================================
    // EMAIL TRANSPORTER
    // ==========================================

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ==========================================
    // PROCESS CUSTOMERS
    // ==========================================

    for (const customer of customers) {
      try {
        // ==================================================
        // EMAIL #2
        // 24 HOURS AFTER EMAIL #1
        // ==================================================

        if (
          customer.accidentalWarrantyStatus === "waiting" &&
          customer.warrantyEmailSentAt &&
          !customer.accidentalProcessEmailSentAt &&
          new Date(customer.warrantyEmailSentAt) <=
          twentyFourHoursAgo
        ) {
          console.log(
            `EMAIL #2 DUE: ${customer.email}`
          );

          const emailResponse = await fetch(
            new URL(
              "/api/send-accidental-process-email",
              request.url
            ),
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                customerName:
                  customer.customerName,

                email:
                  customer.email,

                vehicleModel:
                  customer.vehicleModel || "",

                vehicleNo:
                  customer.vehicleNo,

                certificateNo:
                  customer.certificateNo || "",
              }),
            }
          );

          const emailResult =
            await emailResponse.json();

          if (
            emailResponse.ok &&
            emailResult.success
          ) {
            const sentAt = new Date();

            await db
              .collection("customers")
              .updateOne(
                { _id: customer._id },

                {
                  $set: {
                    accidentalProcessEmailSentAt:
                      sentAt,

                    accidentalWarrantyStatus:
                      "processing",

                    updatedAt: sentAt,
                  },
                }
              );

            processEmailsSent++;

            console.log(
              `EMAIL #2 SENT: ${customer.email}`
            );
          } else {
            console.error(
              `EMAIL #2 FAILED: ${customer.email}`,
              emailResult
            );
          }
        }

        // ==================================================
        // EMAIL #3
        // 24 HOURS AFTER EMAIL #2
        // ==================================================

        const latestCustomer =
          await db
            .collection("customers")
            .findOne({
              _id: customer._id,
            });

        if (
          latestCustomer &&
          latestCustomer.accidentalWarrantyStatus ===
          "processing" &&
          latestCustomer.accidentalProcessEmailSentAt &&
          !latestCustomer.accidentalWarrantyEmailSentAt &&
          new Date(
            latestCustomer.accidentalProcessEmailSentAt
          ) <= twentyFourHoursAgo
        ) {
          console.log(
            `EMAIL #3 DUE: ${latestCustomer.email}`
          );

          let browser;

          try {
            // ==========================================
            // ACCIDENTAL WARRANTY DATA
            // ==========================================

            const accidentalWarrantyData = {
              customerName:
                latestCustomer.customerName || "",

              vehicle:
                latestCustomer.vehicleModel || "",

              registrationNo:
                latestCustomer.vehicleNo || "",

              vin:
                latestCustomer.vin || "",

              installationDate:
                latestCustomer.serviceDate
                  ? new Date(
                    latestCustomer.serviceDate
                  ).toLocaleDateString("en-IN")
                  : "",

              certificateNo:
                latestCustomer.certificateNo || "",
            };

            // ==========================================
            // GENERATE HTML
            // ==========================================

            const html =
              getAccidentalWarrantyCertificateHtml(
                accidentalWarrantyData
              );

            // ==========================================
            // PUPPETEER PDF
            // ==========================================

            browser = await puppeteer.launch({
              headless: true,

              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
              ],
            });

            const page =
              await browser.newPage();

            await page.setContent(html, {
              waitUntil: "load",
            });

            const pdfBuffer =
              await page.pdf({
                format: "A4",
                printBackground: true,
                preferCSSPageSize: true,
              });

            await browser.close();

            browser = undefined;

            // ==========================================
            // SEND EMAIL #3
            // ==========================================

            await transporter.sendMail({
              from: `"Paint Shield India" <${process.env.GMAIL_USER}>`,

              to: latestCustomer.email,

              subject:
                "Paint Shield India — Accidental Warranty Certificate",

              text: `Dear ${latestCustomer.customerName || "Customer"
                },

Your Paint Shield India 1-Year Accidental Warranty Certificate is now ready.

Please find your Accidental Warranty Certificate attached with this email.

Certificate No.: ${latestCustomer.certificateNo || "—"
                }

Please keep this certificate safely for your records.

Regards,
Paint Shield India
+91 6367629112
info@paintshieldindia.com`,

              html: `
                <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #222;">

                  <h2 style="color:#9b7205;">
                    Paint Shield India
                  </h2>

                  <p>
                    Dear ${latestCustomer.customerName ||
                "Customer"
                },
                  </p>

                  <p>
                    Your
                    <strong>
                      1-Year Accidental Warranty Certificate
                    </strong>
                    is now ready.
                  </p>

                  <p>
                    Please find your
                    <strong>
                      Accidental Warranty Certificate PDF
                    </strong>
                    attached with this email.
                  </p>

                  <p>
                    <strong>
                      Certificate No.:
                    </strong>
                    ${latestCustomer.certificateNo ||
                "—"
                }
                  </p>

                  <p>
                    Please keep this certificate safely
                    for your records.
                  </p>

                  <br />

                  <p>
                    Regards,<br />
                    <strong>
                      Paint Shield India
                    </strong>
                  </p>

                  <p style="color:#666;">
                    +91 6367629112<br />
                    info@paintshieldindia.com
                  </p>

                </div>
              `,

              attachments: [
                {
                  filename: `Accidental-Warranty-${latestCustomer.certificateNo || "Certificate"}.pdf`,

                  content: pdfBuffer,

                  contentType: "application/pdf",
                },
              ],
            });

            // ==========================================
            // MARK EMAIL #3 AS SENT
            // ==========================================

            const sentAt = new Date();

            await db
              .collection("customers")
              .updateOne(
                { _id: latestCustomer._id },

                {
                  $set: {
                    accidentalWarrantyEmailSentAt:
                      sentAt,

                    accidentalWarrantyStatus:
                      "completed",

                    updatedAt: sentAt,
                  },
                }
              );

            accidentalEmailsSent++;

            console.log(
              `EMAIL #3 SENT: ${latestCustomer.email}`
            );
          } catch (email3Error) {
            console.error(
              `EMAIL #3 ERROR FOR ${latestCustomer.email}:`,
              email3Error
            );

            if (browser) {
              try {
                await browser.close();
              } catch (closeError) {
                console.error(
                  "PUPPETEER CLOSE ERROR:",
                  closeError
                );
              }
            }
          }
        }
      } catch (customerError) {
        console.error(
          `WARRANTY ERROR FOR ${customer.email}:`,
          customerError
        );
      }
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      message:
        "Warranty automation check completed.",

      checkedCustomers:
        customers.length,

      processEmailsSent,

      accidentalEmailsSent,
    });
  } catch (error) {
    console.error(
      "WARRANTY CRON ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },

      { status: 500 }
    );
  }
}
