import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
  <body style="margin: 0; padding: 40px 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 32px 40px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
          GETPROFILE<span style="color: #a5b4fc;">.LINK</span>
        </h1>
      </div>
      <!-- Content -->
      <div style="padding: 40px;">
        ${content}
      </div>
      <!-- Footer -->
      <div style="padding: 24px 40px; background-color: #0f172a; text-align: center; border-top: 1px solid #334155;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          © ${new Date().getFullYear()} getprofile.link. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`;

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return { success: true, simulated: true };
  try {
    const data = await resend.emails.send({
      from: "getprofile.link <onboarding@getprofile.link>",
      to: [to],
      subject: "Welcome to getprofile.link! 🚀",
      html: emailLayout(`
        <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Welcome to the elite, ${name}!</h2>
        <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
          Your creator portfolio is ready. It's time to consolidate your links, showcase your work, and monetize your audience — all in one premium space.
        </p>
        <div style="text-align: center;">
          <a href="https://getprofile.link/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
            Enter Dashboard
          </a>
        </div>
      `),
    });
    return { success: true, data };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return { success: false, error };
  }
}

export async function sendBookingNotification(creatorEmail: string, guestName: string, date: string, time: string) {
  if (!process.env.RESEND_API_KEY) return { success: true, simulated: true };
  try {
    await resend.emails.send({
      from: "getprofile.link <bookings@getprofile.link>",
      to: [creatorEmail],
      subject: `New Booking Request from ${guestName}`,
      html: emailLayout(`
        <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">You have a new booking! 📅</h2>
        <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
          <strong>${guestName}</strong> just requested a meeting for <strong>${date} at ${time}</strong>.
        </p>
        <div style="text-align: center;">
           <a href="https://getprofile.link/dashboard/bookings" style="display: inline-block; padding: 16px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; text-transform: uppercase;">
             Review Request
           </a>
        </div>
      `),
    });
  } catch (err) { console.error(err); }
}

export async function sendPurchaseReceipt(customerEmail: string, productName: string, amount: number, downloadUrl?: string) {
  if (!process.env.RESEND_API_KEY) return { success: true, simulated: true };
  try {
    await resend.emails.send({
      from: "getprofile.link <store@getprofile.link>",
      to: [customerEmail],
      subject: `Your receipt for ${productName} 🧾`,
      html: emailLayout(`
        <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Payment Successful! 🎉</h2>
        <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 16px;">
          Thank you for your purchase of <strong>${productName}</strong>.
        </p>
        <p style="margin: 0 0 24px 0; color: #a5b4fc; font-size: 24px; font-weight: bold;">
          Total: $${amount.toFixed(2)}
        </p>
        ${downloadUrl ? `
          <div style="text-align: center;">
             <a href="${downloadUrl}" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; text-transform: uppercase;">
               Download Access
             </a>
          </div>
        ` : ''}
      `),
    });
  } catch (err) { console.error(err); }
}
