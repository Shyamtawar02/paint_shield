import fs from "fs";
import path from "path";

type AccidentalWarrantyData = {
  customerName: string;
  vehicle?: string;
  registrationNo?: string;
  vin?: string;
  installationDate?: string;
  certificateNo: string;
};

function getLogoDataUrl() {
  const logoPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "paint-shield-logo.jpeg"
  );

  const logoBuffer = fs.readFileSync(logoPath);
  const base64 = logoBuffer.toString("base64");

  return `data:image/jpeg;base64,${base64}`;
}

export function getAccidentalWarrantyCertificateHtml(
  data: AccidentalWarrantyData
) {
  const logoDataUrl = getLogoDataUrl();

  const {
    customerName,
    vehicle,
    registrationNo,
    vin,
    installationDate,
    certificateNo,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8" />

<style>

  /* =========================================
     A4 PAGE
  ========================================= */

  @page {
    size: A4;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    background: #ffffff;
    overflow: hidden;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #222;
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  .page {
    width: 210mm;
    height: 297mm;
    padding: 10mm;
    position: relative;
    overflow: hidden;
    background: #ffffff;
  }

  /* =========================================
     GOLD BORDER
  ========================================= */

  .border {
    width: 100%;
    height: 277mm;
    border: 2px solid #b8860b;
    padding: 10mm;
    position: relative;
    overflow: hidden;
  }

  /* =========================================
     TOP GOLD LINE
  ========================================= */

  .top-line {
    height: 3px;
    background: #b8860b;
    margin-bottom: 9px;
  }

  /* =========================================
     LOGO
  ========================================= */

  .logo {
    text-align: center;
    height: 48px;
    margin-bottom: 4px;
  }

  .logo img {
    width: 120px;
    height: 48px;
    object-fit: contain;
  }

  /* =========================================
     BRAND
  ========================================= */

  .brand {
    text-align: center;
    font-size: 10px;
    letter-spacing: 2px;
    color: #777;
    margin-bottom: 7px;
  }

  /* =========================================
     TITLE
  ========================================= */

  h1 {
    text-align: center;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 27px;
    line-height: 1.1;
    color: #9b7205;
  }

  .subtitle {
    text-align: center;
    margin-top: 4px;
    color: #666;
    font-size: 10px;
  }

  /* =========================================
     1 YEAR BOX
  ========================================= */

  .year-box {
    width: 160px;
    margin: 9px auto;
    border: 2px solid #b8860b;
    padding: 8px;
    text-align: center;
  }

  .year {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 24px;
    line-height: 1;
    font-weight: bold;
    color: #9b7205;
  }

  .year-text {
    margin-top: 3px;
    font-size: 9px;
    letter-spacing: 1px;
    color: #555;
  }

  /* =========================================
     CUSTOMER INFORMATION
  ========================================= */

  .certificate-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 18px;
    margin: 7px 0;
  }

  .info-box {
    border-bottom: 1px solid #ddd;
    padding: 3px 0;
  }

  .label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #888;
    line-height: 1.1;
  }

  .value {
    margin-top: 2px;
    font-size: 11px;
    line-height: 1.15;
    font-weight: bold;
    color: #222;
  }

  /* =========================================
     SECTIONS
  ========================================= */

  .section {
    margin-top: 7px;
    page-break-inside: avoid;
  }

  .section-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 14px;
    line-height: 1.1;
    color: #9b7205;
    border-bottom: 1px solid #d9bd62;
    padding-bottom: 3px;
    margin-bottom: 4px;
  }

  .section p {
    font-size: 9.5px;
    line-height: 1.35;
    margin: 3px 0;
  }

  /* =========================================
     LIST
  ========================================= */

  ul {
    margin: 3px 0 0 17px;
    padding: 0;
  }

  li {
    font-size: 9.5px;
    line-height: 1.35;
    margin-bottom: 2px;
  }

  /* =========================================
     HIGHLIGHT BOX
  ========================================= */

  .highlight {
    background: #fbf6e7;
    border-left: 3px solid #b8860b;
    padding: 6px 9px;
    margin-top: 5px;
    font-size: 9.5px;
    line-height: 1.35;
  }

  /* =========================================
     SIGNATURE
  ========================================= */

  .signature {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    page-break-inside: avoid;
  }

  .signature-left {
    font-size: 9px;
    line-height: 1.3;
    color: #777;
  }

  .signature-right {
    text-align: center;
    min-width: 145px;
  }

  .signature-line {
    border-top: 1px solid #555;
    margin-top: 13px;
    padding-top: 3px;
    font-size: 9px;
  }

  /* =========================================
     FOOTER
  ========================================= */

  .footer {
    position: absolute;
    bottom: 4mm;
    left: 10mm;
    right: 10mm;
    text-align: center;
    font-size: 8px;
    line-height: 1;
    color: #888;
  }

  .footer strong {
    color: #9b7205;
  }

</style>

</head>

<body>

<div class="page">

  <div class="border">

    <!-- TOP LINE -->
    <div class="top-line"></div>


    <!-- LOGO -->
    <div class="logo">

      <img src="${logoDataUrl}" />

    </div>


    <!-- BRAND -->
    <div class="brand">
      PAINT SHIELD INDIA
    </div>


    <!-- TITLE -->
    <h1>
      Accidental Warranty Certificate
    </h1>

    <div class="subtitle">
      Official Accidental Protection Certificate
    </div>


    <!-- 1 YEAR -->
    <div class="year-box">

      <div class="year">
        1 YEAR
      </div>

      <div class="year-text">
        ACCIDENTAL WARRANTY
      </div>

    </div>


    <!-- CUSTOMER INFORMATION -->
    <div class="certificate-info">

      <div class="info-box">

        <div class="label">
          Customer Name
        </div>

        <div class="value">
          ${customerName || "—"}
        </div>

      </div>


      <div class="info-box">

        <div class="label">
          Certificate No.
        </div>

        <div class="value">
          ${certificateNo || "—"}
        </div>

      </div>


      <div class="info-box">

        <div class="label">
          Vehicle
        </div>

        <div class="value">
          ${vehicle || "—"}
        </div>

      </div>


      <div class="info-box">

        <div class="label">
          Registration No.
        </div>

        <div class="value">
          ${registrationNo || "—"}
        </div>

      </div>


      <div class="info-box">

        <div class="label">
          VIN
        </div>

        <div class="value">
          ${vin || "—"}
        </div>

      </div>


      <div class="info-box">

        <div class="label">
          Installation Date
        </div>

        <div class="value">
          ${installationDate || "—"}
        </div>

      </div>

    </div>


    <!-- ACCIDENTAL WARRANTY COVERAGE -->
    <div class="section">

      <div class="section-title">
        Accidental Warranty Coverage
      </div>

      <p>
        This certificate confirms that the above vehicle is covered
        under the Paint Shield India 1-Year Accidental Warranty.
      </p>

      <div class="highlight">

        The accidental warranty covers eligible accidental damage
        to the installed Paint Protection Film (PPF), subject to
        inspection, verification and approval by Paint Shield India.

      </div>

    </div>


    <!-- WARRANTY TERMS -->
    <div class="section">

      <div class="section-title">
        Warranty Terms
      </div>

      <ul>

        <li>
          Maximum
          <strong>2 accidental claims per warranty year</strong>
          are permitted.
        </li>

        <li>
          The damaged PPF section may be replaced only after
          inspection and approval.
        </li>

        <li>
          Labour and installation charges are
          <strong>not included</strong>
          and are payable by the customer.
        </li>

        <li>
          Coverage is applicable only to PPF installed by an
          authorized Paint Shield India installer.
        </li>

      </ul>

    </div>


    <!-- EXCLUSIONS -->
    <div class="section">

      <div class="section-title">
        Exclusions
      </div>

      <ul>

        <li>
          Improper maintenance or misuse of the PPF.
        </li>

        <li>
          Intentional or deliberate damage.
        </li>

        <li>
          Chemical contamination or chemical damage.
        </li>

        <li>
          Normal wear and tear.
        </li>

        <li>
          Any damage or condition not covered under the applicable
          Paint Shield India warranty terms.
        </li>

      </ul>

    </div>


    <!-- IMPORTANT -->
    <div class="section">

      <div class="section-title">
        Important
      </div>

      <p>
        Please retain this certificate for your records.
        All accidental warranty claims are subject to inspection,
        verification and approval by Paint Shield India.
      </p>

    </div>


    <!-- SIGNATURE -->
    <div class="signature">

      <div class="signature-left">

        Digitally issued by<br />

        <strong>
          Paint Shield India
        </strong>

      </div>


      <div class="signature-right">

        <div class="signature-line">
          Authorized Signatory
        </div>

      </div>

    </div>

  </div>


  <!-- FOOTER -->
  <div class="footer">

    <strong>
      Paint Shield India
    </strong>

    &nbsp; | &nbsp;

    +91 6367629112

    &nbsp; | &nbsp;

    info@paintshieldindia.com

  </div>

</div>

</body>
</html>
`;
}