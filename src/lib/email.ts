import { Resend } from "resend";

// Ensure RESEND_API_KEY exists in production
const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Service Simulated] 📩 Welcome Email sent to ${to}`);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: "getprofile.link <onboarding@getprofile.link>",
      to: [to],
      subject: "Welcome to getprofile.link! 🚀",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px;">
          <h2 style="color: #4f46e5;">Welcome to getprofile.link, ${name}!</h2>
          <p>We're excited to have you join our community of elite creators.</p>
          <a href="https://getprofile.link/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            Go to Dashboard
          </a>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return { success: false, error };
  }
}
