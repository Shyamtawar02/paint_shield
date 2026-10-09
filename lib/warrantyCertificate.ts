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
<html>
<head>
<meta charset="utf-8">
<title>Paint Shield — Warranty Certificate ${certificateNo}</title>

<style>
@page {
  size: A4 portrait;
  margin: 6mm;
}

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Times New Roman', Georgia, serif;
    color: #1a1a1a;
    background: #fff;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .sheet {
  width: 100%;
  min-height: 0;
  padding: 0;
  margin: 0;
  background: #fff;
}

.frame {
  border: 2px solid #b8860b;
  padding: 5mm;
  position: relative;
  min-height: 0;
}
  .frame::before {
    content: "";
    position: absolute;
    inset: 4px;
    border: 1px solid #e6c764;
    pointer-events: none;
  }

  .gold {
    color: #b8860b;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #d4af37;
    padding-bottom: 14px;
    gap: 24px;
  }

  .brand-eyebrow {
    font-size: 9px;
    letter-spacing: 6px;
    color: #b8860b;
    margin: 0 0 6px;
    text-transform: uppercase;
  }

  .brand-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 26px;
    margin: 0 0 8px;
    letter-spacing: 1px;
  }

  .title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px;
    margin: 6px 0 0;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .studio {
    font-size: 11px;
    line-height: 1.55;
    text-align: right;
    min-width: 220px;
  }

  .studio b {
    color: #b8860b;
    letter-spacing: 1px;
    font-size: 10px;
    text-transform: uppercase;
    display: block;
    margin-bottom: 4px;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fbf6e7;
    border: 1px solid #e6c764;
    padding: 8px 14px;
    margin: 14px 0 18px;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .meta b {
    color: #b8860b;
  }

  .section-label {
    font-size: 9px;
    letter-spacing: 4px;
    color: #b8860b;
    text-transform: uppercase;
    margin: 14px 0 6px;
    border-bottom: 1px solid #eadfbb;
    padding-bottom: 4px;
  }

  table.details {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  table.details td {
    padding: 7px 4px;
    border-bottom: 1px dotted #d8c98a;
    vertical-align: top;
  }

  table.details td.k {
    color: #666;
    width: 30%;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 10px;
  }

  table.details td.v {
    font-weight: bold;
  }

  .coverage {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 10px 14px;
    background: #fbf6e7;
    border: 1px solid #e6c764;
  }

  .coverage .yrs {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px;
    color: #b8860b;
  }

  .terms {
    margin-top: 18px;
    border: 1px solid #d4af37;
    padding: 12px 14px;
    background: #fffdf6;
  }

  .terms h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin: 0 0 10px;
    color: #1a1a1a;
    border-bottom: 1px solid #e6c764;
    padding-bottom: 6px;
    text-align: center;
  }

  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .term {
    font-size: 10.5px;
    line-height: 1.5;
  }

  .term .num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 16px;
    color: #b8860b;
  }

  .term b {
    display: block;
    margin: 2px 0 4px;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #d4af37;
    font-size: 10px;
    color: #555;
  }

  .sign {
    text-align: right;
  }

  .sign .line {
    width: 220px;
    border-bottom: 1px solid #b8860b;
    height: 28px;
    margin-left: auto;
  }

  .sign .role {
    margin-top: 4px;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #1a1a1a;
  }
</style>

</head>

<body>

<div class="sheet">
<div class="frame">

  <div class="header">

    <div style="display:flex;align-items:center;gap:12px;">

      <img
  src="${logoDataUrl}"
  alt="Paint Shield"
  style="height:60px;width:auto;"
/>

      <div>

        <p class="brand-eyebrow">
          Choose Paint Shield. Choose Peace of Mind.
        </p>

        <h1 class="brand-name">
          PAINT SHIELD
        </h1>

        <p class="title">
          Digital Warranty Certificate
        </p>

      </div>

    </div>

    <div class="studio">

      <b>Contact</b>

      Paint Shield India<br/>

      Contact: +91 7701099982<br/>

      Email: info@paintshieldindia.com<br/>

      Services: Premium PPF, Window Tint

    </div>
s
  </div>


  <div class="meta">

    <span>
      Certificate No:
      <b>${certificateNo}</b>
    </span>

    <span>
      Issued:
      <b>${issuedFmt}</b>
    </span>

    <span>
      Status:
      <b>ACTIVE</b>
    </span>

  </div>


  <p class="section-label">
    Customer &amp; Service Details
  </p>


  <table class="details">

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
      <td class="v">${contactNo}</td>

      <td class="k">Email</td>
      <td class="v">${email || "—"}</td>
    </tr>

    <tr>
      <td class="k">Service Type</td>
      <td class="v">${serviceType}</td>

      <td class="k">Service Date</td>
      <td class="v">${serviceDateFmt}</td>
    </tr>

    <tr>
      <td class="k">Warranty Period</td>
      <td class="v gold">${warrantyNum} Years</td>

      <td class="k">Valid Until</td>
      <td class="v">${endDateFmt}</td>
    </tr>

  </table>


  <div class="coverage">

    <div>

      <b>Coverage Remaining</b>

      <br/>

      <span style="font-size:10px;color:#666;">
        Years of Protection Left
      </span>

    </div>

    <div class="yrs">
      ${yearsLeft} / ${warrantyNum} yrs
    </div>

  </div>


  <div class="terms">

    <h3>
      Official Maintenance Terms &amp; Pro-Care Guidelines
    </h3>

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

        Strictly avoid alkaline degreasers, automatic brush
        washes, and abrasive polishes. Wipe bird droppings
        or tree sap within 48 hours using a damp microfiber.

      </div>

    </div>

    <p style="margin:10px 0 0;font-size:9.5px;color:#777;text-align:center;letter-spacing:1px;text-transform:uppercase;">

      Failure to follow these guidelines may void warranty coverage.

    </p>

  </div>


  <div class="terms" style="margin-top:12px;">

    <h3>
      Warranty Coverage &amp; Terms
    </h3>


    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:12px;">

      <div style="border-right:1px solid #e6c764;padding-right:16px;">

        <p style="margin:0 0 10px;font-size:10px;">
          ✓ The warranty is applicable if the Paint Protection Film
          (PPF) peels off due to a manufacturing defect.
        </p>

        <p style="margin:0 0 10px;font-size:10px;">
          ✓ The warranty covers excessive bubbling caused by
          material failure.
        </p>

        <p style="margin:0;font-size:10px;">
          ✓ The warranty covers yellowing exceeding 10% of the
          film's original appearance under normal usage conditions.
        </p>

      </div>


      <div style="padding-left:6px;">

        <p style="margin:0 0 10px;font-size:10px;">
          ✕ Damage caused by accidents, collisions, or external
          impacts is not covered.
        </p>

        <p style="margin:0 0 10px;font-size:10px;">
          ✕ Edge lifting or peeling resulting from improper use
          of high-pressure washing is not covered.
        </p>

        <p style="margin:0;font-size:10px;">
          ✕ Damage caused by improper maintenance, neglect,
          or failure to follow recommended care instructions
          is not covered.
        </p>

      </div>

    </div>


    <div style="margin-top:12px;padding-top:10px;border-top:1px solid #e6c764;font-size:10px;line-height:1.6;">

      <div>
        ✓ Warranty coverage is provided by the PPF manufacturer.
      </div>

      <div>
        ✓ Replacement film is covered as per manufacturer policy.
      </div>

      <div>
        ✓ Installation or reinstallation charges may be chargeable
        through the authorized detailer.
      </div>

      <div>
        ✓ All warranty claims receive an initial response within
        24 working hours.
      </div>

    </div>

  </div>


  <div class="footer">

    <div>

      This certificate is digitally issued and verifiable at
      the Paint Shield India Warranty Portal.

      <br/>

      Certificate ID: ${certificateNo}

    </div>


    <div class="sign">

      <div class="line"></div>

      <div class="role">
        Authorized Signatory — Paint Shield
      </div>

    </div>

  </div>

</div>
</div>

</body>
</html>`;
}