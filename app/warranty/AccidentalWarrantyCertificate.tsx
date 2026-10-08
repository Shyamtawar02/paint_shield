"use client";

import React from "react";

type AccidentalWarrantyData = {
  customerName: string;
  vehicle?: string;
  registrationNo?: string;
  vin?: string;
  installationDate?: string;
  certificateNo: string;
};

type Props = {
  data: AccidentalWarrantyData;
};

export default function AccidentalWarrantyCertificate({ data }: Props) {
  const printCertificate = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Accidental Warranty Certificate - ${data.certificateNo}</title>

        <style>
          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #fff;
            font-family: Georgia, "Times New Roman", serif;
            color: #1a1a1a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm;
            margin: auto;
          }

          .certificate {
            min-height: 273mm;
            border: 2px solid #b8860b;
            padding: 10mm;
            position: relative;
          }

          .certificate:before {
            content: "";
            position: absolute;
            inset: 5px;
            border: 1px solid #e6c764;
            pointer-events: none;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #d4af37;
          }

          .logo {
            height: 58px;
            width: auto;
          }

          .eyebrow {
            margin: 0 0 5px;
            font-size: 9px;
            letter-spacing: 4px;
            color: #b8860b;
            text-transform: uppercase;
          }

          .brand {
            margin: 0;
            font-size: 25px;
            letter-spacing: 2px;
          }

          .title {
            margin: 8px 0 0;
            font-size: 17px;
            letter-spacing: 3px;
            text-transform: uppercase;
          }

          .contact {
            text-align: right;
            font-size: 10px;
            line-height: 1.6;
          }

          .gold {
            color: #b8860b;
          }

          .meta {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            padding: 8px 12px;
            background: #fbf6e7;
            border: 1px solid #e6c764;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .section-title {
            margin: 16px 0 7px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eadfbb;
            color: #b8860b;
            font-size: 9px;
            letter-spacing: 3px;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          td {
            padding: 7px 4px;
            border-bottom: 1px dotted #d8c98a;
          }

          .label {
            width: 25%;
            color: #666;
            font-size: 9px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .value {
            font-weight: bold;
          }

          .highlight {
            margin-top: 14px;
            padding: 12px;
            background: #fbf6e7;
            border: 1px solid #e6c764;
            text-align: center;
          }

          .highlight-title {
            font-size: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .highlight-value {
            margin-top: 5px;
            font-size: 22px;
            color: #b8860b;
          }

          .box {
            margin-top: 14px;
            padding: 12px;
            border: 1px solid #d4af37;
            background: #fffdf6;
          }

          .box-title {
            margin: 0 0 8px;
            text-align: center;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .box p {
            margin: 5px 0;
            font-size: 10px;
            line-height: 1.55;
          }

          .columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .column {
            font-size: 10px;
            line-height: 1.55;
          }

          .column-title {
            margin-bottom: 7px;
            font-weight: bold;
            font-size: 10px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .important {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #e6c764;
            font-weight: bold;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px solid #d4af37;
            font-size: 9px;
            color: #555;
          }

          .signature {
            text-align: right;
          }

          .signature-line {
            width: 180px;
            height: 25px;
            margin-left: auto;
            border-bottom: 1px solid #b8860b;
          }

          .signature-role {
            margin-top: 4px;
            color: #1a1a1a;
            font-size: 9px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          @media print {
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>

      <body>
        <div class="page">
          <div class="certificate">

            <div class="header">
              <div style="display:flex;align-items:center;gap:12px;">
                <img
                  src="/assets/paint-shield-logo.jpeg"
                  class="logo"
                  alt="Paint Shield India"
                />

                <div>
                  <p class="eyebrow">
                    Choose Paint Shield. Choose Peace of Mind.
                  </p>

                  <h1 class="brand">PAINT SHIELD</h1>

                  <p class="title">
                    Accidental Warranty Certificate
                  </p>
                </div>
              </div>

              <div class="contact">
                <strong class="gold">PAINT SHIELD INDIA</strong><br/>
                +91 7701099983<br/>
                info@paintshieldindia.com<br/>
                www.paintshieldindia.com
              </div>
            </div>

            <div class="meta">
              <span>
                Certificate No:
                <b class="gold">${data.certificateNo}</b>
              </span>

              <span>
                Status:
                <b class="gold">ACTIVE</b>
              </span>
            </div>

            <p class="section-title">
              Customer & Vehicle Details
            </p>

            <table>
              <tr>
                <td class="label">Customer Name</td>
                <td class="value">${data.customerName || "—"}</td>

                <td class="label">Vehicle</td>
                <td class="value">${data.vehicle || "—"}</td>
              </tr>

              <tr>
                <td class="label">Registration No.</td>
                <td class="value">${data.registrationNo || "—"}</td>

                <td class="label">VIN / Chassis No.</td>
                <td class="value">${data.vin || "—"}</td>
              </tr>

              <tr>
                <td class="label">PPF Installation Date</td>
                <td class="value">${data.installationDate || "—"}</td>

                <td class="label">Warranty Certificate</td>
                <td class="value">${data.certificateNo}</td>
              </tr>
            </table>

            <div class="highlight">
              <div class="highlight-title">
                Accidental Warranty
              </div>

              <div class="highlight-value">
                1 YEAR
              </div>

              <div style="font-size:10px;">
                Maximum <strong>2 accidental claims</strong> per warranty year
              </div>
            </div>

            <div class="box">
              <h3 class="box-title">
                Accidental Warranty Coverage
              </h3>

              <p>
                In case of accidental damage to the PPF, the affected PPF
                section may be replaced under the warranty, subject to
                inspection and approval by Paint Shield India.
              </p>

              <p>
                The customer can avail a maximum of
                <strong>2 accidental warranty claims</strong>
                during the warranty year.
              </p>

              <p class="important">
                Labour / installation charges are NOT included in the
                warranty coverage and shall be payable separately by the
                customer.
              </p>
            </div>

            <div class="box">
              <h3 class="box-title">
                Warranty Conditions
              </h3>

              <div class="columns">

                <div class="column">
                  <div class="column-title gold">
                    Coverage
                  </div>

                  <p>
                    ✓ Accidental damage to the installed PPF may be eligible
                    for replacement.
                  </p>

                  <p>
                    ✓ Each claim is subject to inspection and approval.
                  </p>

                  <p>
                    ✓ Maximum 2 accidental claims per warranty year.
                  </p>
                </div>

                <div class="column">
                  <div class="column-title">
                    Exclusions
                  </div>

                  <p>
                    ✕ Improper maintenance or misuse.
                  </p>

                  <p>
                    ✕ Intentional damage.
                  </p>

                  <p>
                    ✕ Chemical contamination.
                  </p>

                  <p>
                    ✕ Normal wear and tear.
                  </p>

                  <p>
                    ✕ Other exclusions specified in the warranty terms.
                  </p>
                </div>

              </div>
            </div>

            <div class="box">
              <h3 class="box-title">
                Important Information
              </h3>

              <p>
                This warranty is applicable only to the PPF installed by an
                authorized Paint Shield India installer.
              </p>

              <p>
                Warranty coverage is subject to inspection and approval by
                Paint Shield India.
              </p>

              <p>
                Labour and installation charges are separate from the
                accidental warranty and will be charged as applicable.
              </p>
            </div>

            <div class="footer">
              <div>
                This certificate is digitally issued by Paint Shield India.<br/>
                Certificate ID: <strong>${data.certificateNo}</strong>
              </div>

              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-role">
                  Authorized Signatory — Paint Shield
                </div>
              </div>
            </div>

          </div>
        </div>

        <script>
          setTimeout(function() {
            window.print();
          }, 400);
        </script>

      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="rounded-3xl border-2 border-gold bg-card p-6 md:p-8 shadow-luxe">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Accidental Protection
          </p>

          <h2 className="font-display text-2xl md:text-3xl mt-1">
            1-Year Accidental Warranty
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Up to 2 accidental claims per warranty year.
            Labour charges are payable separately.
          </p>
        </div>

        <button
          onClick={printCertificate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors"
        >
          Download / Print Certificate
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Coverage
          </p>
          <p className="mt-1 font-display text-xl">
            1 Year
          </p>
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Claims
          </p>
          <p className="mt-1 font-display text-xl">
            2 / Year
          </p>
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Certificate
          </p>
          <p className="mt-1 font-display text-sm text-gold break-all">
            {data.certificateNo}
          </p>
        </div>
      </div>
    </div>
  );
}