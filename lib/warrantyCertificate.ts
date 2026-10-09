
import fs from "fs";
import path from "path";

type WarrantyCertificateData = {
  certificateNo: string;
  issuedFmt: string;
  customerName: string;
  vehicleModel: string;
  vehicleNo: string;
  studio: string;
  contactNo: string;
  email: string;
  serviceType: string;
  serviceDateFmt: string;
  warrantyNum: number;
  endDateFmt: string;
  yearsLeft: string;
};

export function getWarrantyCertificateHtml(
  data: WarrantyCertificateData
) {
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

  const logoPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "paint-shield-logo.jpeg"
  );

  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Paint Shield India - Warranty Certificate ${certificateNo}</title>

<style>
  @page {
    size: A4 portrait;
    margin: 7mm;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    color: #1a1a1a;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-size: 9px;
  }

  .sheet {
    width: 100%;
    margin: 0;
    padding: 0;
    background: #fff;
  }

  .frame {
    position: relative;
    border: 2px solid #b8860b;
    padding: 5mm;
    background: #fff;
  }

  .frame::before {
    content: "";
    position: absolute;
    inset: 3px;
    border: 1px solid #e6c764;
    pointer-events: none;
  }

  .gold {
    color: #b8860b;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-bottom: 7px;
    border-bottom: 1px solid #d4af37;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  .logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .brand-eyebrow {
    margin: 0 0 3px;
    color: #b8860b;
    font-family: Arial, sans-serif;
    font-size: 6px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .brand-name {
    margin: 0;
    font-size: 21px;
    line-height: 1.1;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .title {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.25;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .studio {
    flex-shrink: 0;
    text-align: right;
    font-family: Arial, sans-serif;
    font-size: 7.5px;
    line-height: 1.45;
  }

  .studio b {
    display: block;
    margin-bottom: 2px;
    color: #b8860b;
    font-size: 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px 10px;
    margin: 8px 0;
    padding: 6px 8px;
    border: 1px solid #e6c764;
    background: #fbf6e7;
    font-family: Arial, sans-serif;
    font-size: 7.5px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .meta b {
    color: #b8860b;
  }

  .section-label {
    margin: 7px 0 3px;
    padding-bottom: 3px;
    border-bottom: 1px solid #eadfbb;
    color: #b8860b;
    font-family: Arial, sans-serif;
    font-size: 7px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  table.details {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 8px;
  }

  table.details td {
    padding: 4px 3px;
    border-bottom: 1px dotted #d8c98a;
    vertical-align: top;
    overflow-wrap: anywhere;
    line-height: 1.3;
  }

  table.details td.k {
    width: 20%;
    color: #666;
    font-size: 6.5px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  table.details td.v {
    width: 30%;
    font-weight: 600;
  }

  .coverage {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
    padding: 7px 9px;
    border: 1px solid #e6c764;
    background: #fbf6e7;
    font-family: Arial, sans-serif;
  }

  .coverage-title {
    font-size: 9px;
    font-weight: 700;
  }

  .coverage-subtitle {
    margin-top: 3px;
    color: #666;
    font-size: 7px;
  }

  .coverage .yrs {
    color: #b8860b;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 17px;
    white-space: nowrap;
  }

  .terms {
    margin-top: 7px;
    padding: 7px 9px;
    border: 1px solid #d4af37;
    background: #fffdf6;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .terms h3 {
    margin: 0 0 5px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e6c764;
    color: #1a1a1a;
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    text-transform: uppercase;
  }

  .terms-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .term {
    font-family: Arial, sans-serif;
    font-size: 7.2px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .term .num {
    color: #b8860b;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 12px;
  }

  .term b {
    display: block;
    margin: 2px 0;
    font-size: 7px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .guidelines-note {
    margin: 6px 0 0;
    color: #777;
    font-family: Arial, sans-serif;
    font-size: 6.5px;
    line-height: 1.3;
    text-align: center;
    text-transform: uppercase;
  }

  .coverage-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 7px;
    font-family: Arial, sans-serif;
    font-size: 7.2px;
    line-height: 1.4;
  }

  .coverage-column:first-child {
    padding-right: 8px;
    border-right: 1px solid #e6c764;
  }

  .coverage-grid p {
    margin: 0 0 5px;
  }

  .coverage-grid p:last-child {
    margin-bottom: 0;
  }

  .policy {
    margin-top: 7px;
    padding-top: 5px;
    border-top: 1px solid #e6c764;
    font-family: Arial, sans-serif;
    font-size: 7px;
    line-height: 1.45;
  }

  .policy div {
    margin-bottom: 2px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 10px;
    margin-top: 7px;
    padding-top: 6px;
    border-top: 1px solid #d4af37;
    color: #555;
    font-family: Arial, sans-serif;
    font-size: 7px;
    line-height: 1.4;
  }

  .footer-info {
    max-width: 60%;
    overflow-wrap: anywhere;
  }

  .sign {
    flex-shrink: 0;
    text-align: right;
  }

  .sign .line {
    width: 135px;
    height: 18px;
    margin-left: auto;
    border-bottom: 1px solid #b8860b;
  }

  .sign .role {
    margin-top: 3px;
    color: #1a1a1a;
    font-size: 6.5px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }

  @media print {
    html, body {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    .sheet, .frame {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
</head>

<body>
<div class="sheet">
<div class="frame">

  <div class="header">
    <div class="brand">
      <img
        class="logo"
        src="${logoDataUrl}"
        alt="Paint Shield India"
      />

      <div>
        <p class="brand-eyebrow">
          Choose Paint Shield. Choose Peace of Mind.
        </p>

        <h1 class="brand-name">PAINT SHIELD</h1>

        <p class="title">Digital Warranty Certificate</p>
      </div>
    </div>

    <div class="studio">
      <b>Contact</b>
      Paint Shield India<br/>
      Contact: +91 7701099982<br/>
      Email: info@paintshieldindia.com<br/>
      Services: Premium PPF, Window Tint
    </div>
  </div>

  <div class="meta">
    <span>Certificate No: <b>${certificateNo}</b></span>
    <span>Issued: <b>${issuedFmt}</b></span>
    <span>Status: <b>ACTIVE</b></span>
  </div>

  <p class="section-label">Customer &amp; Service Details</p>

  <table class="details">
    <tbody>
      <tr>
        <td class="k">Customer Name</td>
        <td class="v">${customerName}</td>
        <td class="k">Vehicle Model</td>
        <td class="v">${vehicleModel || "—"}</td>
      </tr>

      <tr>
        <td class="k">Vehicle No.</td>
        <td class="v">${vehicleNo}</td>
        <td class="k">Studio</td>
        <td class="v">${studio || "—"}</td>
      </tr>

      <tr>
        <td class="k">Contact</td>
        <td class="v">${contactNo || "—"}</td>
        <td class="k">Email</td>
        <td class="v">${email || "—"}</td>
      </tr>

      <tr>
        <td class="k">Service Type</td>
        <td class="v">${serviceType || "—"}</td>
        <td class="k">Service Date</td>
        <td class="v">${serviceDateFmt}</td>
      </tr>

      <tr>
        <td class="k">Warranty Period</td>
        <td class="v gold">${warrantyNum} Years</td>
        <td class="k">Valid Until</td>
        <td class="v">${endDateFmt}</td>
      </tr>
    </tbody>
  </table>

  <div class="coverage">
    <div>
      <div class="coverage-title">Coverage Remaining</div>
      <div class="coverage-subtitle">Years of Protection Left</div>
    </div>

    <div class="yrs">${yearsLeft} / ${warrantyNum} yrs</div>
  </div>

  <div class="terms">
    <h3>Official Maintenance Terms &amp; Pro-Care Guidelines</h3>

    <div class="terms-grid">
      <div class="term">
        <span class="num">1.</span>
        <b>How to Wash</b>
        Wait 7 days post-install. Use pH-neutral shampoo,
        two-bucket method, and a plush microfiber mitt.
        Avoid pressure washers within 6 inches of edges.
      </div>

      <div class="term">
        <span class="num">2.</span>
        <b>Sun Protection</b>
        Park under shade when possible. While UV exposure
        is harmless to the film, a monthly rinse keeps optics
        pristine and prevents contamination bonding.
      </div>

      <div class="term">
        <span class="num">3.</span>
        <b>Chemical Safety</b>
        Avoid alkaline degreasers, automatic brush washes,
        and abrasive polishes. Wipe bird droppings or tree
        sap within 48 hours using a damp microfiber.
      </div>
    </div>

    <p class="guidelines-note">
      Failure to follow these guidelines may void warranty coverage.
    </p>
  </div>

  <div class="terms">
    <h3>Warranty Coverage &amp; Terms</h3>

    <div class="coverage-grid">
      <div class="coverage-column">
        <p>
          ✓ The warranty applies if the Paint Protection Film
          (PPF) peels due to a manufacturing defect.
        </p>

        <p>
          ✓ Excessive bubbling caused by material failure is covered.
        </p>

        <p>
          ✓ Yellowing exceeding 10% of the film's original appearance
          under normal usage conditions is covered.
        </p>
      </div>

      <div>
        <p>
          ✕ Damage caused by accidents, collisions, or external
          impacts is not covered.
        </p>

        <p>
          ✕ Edge lifting or peeling caused by improper high-pressure
          washing is not covered.
        </p>

        <p>
          ✕ Improper maintenance, neglect, or failure to follow
          recommended care instructions is not covered.
        </p>
      </div>
    </div>

    <div class="policy">
      <div>✓ Warranty coverage is provided by the PPF manufacturer.</div>
      <div>✓ Replacement film is covered as per manufacturer policy.</div>
      <div>✓ Installation or reinstallation charges may be payable through the authorized detailer.</div>
      <div>✓ Warranty claims receive an initial response within 24 working hours.</div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-info">
      This certificate is digitally issued and verifiable at the
      Paint Shield India Warranty Portal.
      <br/>
      Certificate ID: ${certificateNo}
    </div>

    <div class="sign">
      <div class="line"></div>
      <div class="role">Authorized Signatory — Paint Shield</div>
    </div>
  </div>

</div>
</div>
</body>
</html>`;
}