export async function sendWelcomeEmail(userEmail, userName) {
  // Frontend-only placeholder.
  // Real emails require EmailJS, Firebase, Resend, or a backend API.
  console.log(`Welcome email prepared for ${userName} at ${userEmail}`);
  return {
    success: true,
    message: "Welcome email prepared. Connect an email service to send real emails.",
  };
}
