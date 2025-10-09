'use server';
import nodemailer from "nodemailer";

/**
 * Sends a registration confirmation email using MJML Cloud API
 */
export async function sendRegistrationEmail({ name, email, logo, loginUrl, supportUrl }) {
  // 1️⃣ Prepare MJML template as string
  const mjmlTemplate = `
  <mjml>
    <mj-head>
      <mj-attributes>
        <mj-all font-family="Arial, sans-serif" />
        <mj-text font-size="16px" color="#333333" line-height="1.6" />
        <mj-button background-color="#4f46e5" color="#ffffff" border-radius="6px" font-size="16px" />
      </mj-attributes>
    </mj-head>

    <mj-body background-color="#f4f7d2">
      <mj-section background-color="#f4f7d2" padding="20px" border-radius="8px">
        <mj-column>
          <mj-image src="${logo}" alt="Company Logo" width="120px" align="center" />
        </mj-column>
      </mj-section>

      <mj-section background-color="#ffffff" padding="20px" border-radius="8px">
        <mj-column>
          <mj-text font-size="22px" font-weight="bold" align="center" color="#31572C">
            🎉 Registration Successful
          </mj-text>
          <mj-text>
            Hi <strong>${name}</strong>,
            <br /><br />
            Thank you for registering with <strong color="#ECF39E">Ayurसाथी</strong>. We’re excited to have you on board.
          </mj-text>

          <mj-button href="${loginUrl}" align="center">
            Go to Dashboard
          </mj-button>

          <mj-text font-size="14px" color="#666666">
            If you did not create this account, please contact our support team immediately.
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section background-color="#f4f4f7" padding="20px">
        <mj-column>
          <mj-text font-size="12px" color="#888888" align="center">
            © 2025 Ayurसाथी.
            <br />
            <a href="${supportUrl}" style="color:#4f46e5; text-decoration:none;">Contact Support</a>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `;

  // 2️⃣ Call MJML Cloud API
  const mjmlResponse = await fetch("https://api.mjml.io/v1/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from(`${process.env.MJML_APP_ID}:${process.env.MJML_SECRET_KEY}`).toString("base64")
    },
    body: JSON.stringify({ mjml: mjmlTemplate })
  });

  const mjmlData = await mjmlResponse.json();
console.log(mjmlData);

  if (!mjmlData.html) {
    console.error("MJML API errors:", mjmlData.errors);
    throw new Error("MJML API failed");
  }

  const html = mjmlData.html;

  // 3️⃣ Send email with Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ayurसाथी" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 Registration Successful",
    html,
  });
}
