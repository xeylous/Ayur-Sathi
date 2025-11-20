'use server';
import nodemailer from "nodemailer";

/**
 * Sends lab approval credentials via MJML Cloud API + Nodemailer
 * @param {Object} params
 * @param {string} params.name - Lab owner's name
 * @param {string} params.email - Lab owner's email
 * @param {string} params.password - Temporary plain-text password
 * @param {string} params.labId - Unique AyurLab ID
 * @param {string} params.loginUrl - Login page URL
 * @param {string} params.supportUrl - Support/contact URL
 * @param {string} [params.logo] - Logo URL (optional)
 */
export async function sendManufacturerApprovalEmail({ name, email, password, ManuId, loginUrl, supportUrl, logo }) {
  // ✅ 1️⃣ Build the MJML template
  const mjmlTemplate = `
  <mjml>
    <mj-head>
      <mj-attributes>
        <mj-all font-family="Arial, sans-serif" />
        <mj-text font-size="16px" color="#333" line-height="1.6" />
        <mj-button background-color="#31572C" color="#ffffff" border-radius="6px" font-size="16px" />
      </mj-attributes>
    </mj-head>
    <mj-body background-color="#f4f7d2">
      <mj-section background-color="#f4f7d2" padding="20px">
        <mj-column>
          <mj-image src="${logo || `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}" width="120px" align="center" />
        </mj-column>
      </mj-section>

      <mj-section background-color="#ffffff" padding="20px" border-radius="8px">
        <mj-column>
          <mj-text align="center" font-size="22px" font-weight="bold" color="#31572C">
            Your Lab Has Been Approved!
          </mj-text>
          <mj-text>
            Hi <strong>${name}</strong>,<br/><br/>
            Congratulations! Your Manufacture Application (<strong>${ManuId}</strong>) has been successfully approved on <strong>Ayurसाथी</strong>.
          </mj-text>

          <mj-text>
            You can now log in to your Manufacturer dashboard using the credentials below:
          </mj-text>

          <mj-text font-family="monospace" color="#222">
            <strong>Email:</strong> ${email}<br/>
            <strong>Password:</strong> ${password}
          </mj-text>

          <mj-button href="${loginUrl}" align="center">
            Go to Dashboard
          </mj-button>

          <mj-text font-size="14px" color="#666666">
            Please log in and change your password immediately for security.
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section background-color="#f4f4f7" padding="20px">
        <mj-column>
          <mj-text font-size="12px" color="#888888" align="center">
            © 2025 Ayurसाथी.<br/>
            <a href="${supportUrl}" style="color:#4f46e5;text-decoration:none;">Contact Support</a>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `;

  // ✅ 2️⃣ Convert MJML to HTML using MJML Cloud API
  const mjmlResponse = await fetch("https://api.mjml.io/v1/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":
        "Basic " +
        Buffer.from(`${process.env.MJML_APP_ID}:${process.env.MJML_SECRET_KEY}`).toString("base64"),
    },
    body: JSON.stringify({ mjml: mjmlTemplate }),
  });

  const mjmlData = await mjmlResponse.json();
  if (!mjmlData.html) {
    console.error("MJML API error:", mjmlData.errors);
    throw new Error("MJML rendering failed");
  }

  const html = mjmlData.html;

  // ✅ 3️⃣ Send the email using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or "smtp.yourprovider.com"
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ayurसाथी" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Ayurसाथी Manufacture Account is Ready!",
    html,
  });

  console.log(`✅ Manufacturer approval email sent to ${email}`);
}
