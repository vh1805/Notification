const BaseConsumer = require("./BaseConsumer");
const { sendWelcomeEmail } = require("../../service/EmailService");

class EmailConsumer extends BaseConsumer {
  constructor(channel) {
    super("email_queue", channel);
  }

  async start() {
    await this.consume(async (message) => {
      const { email, name } = message;

      if (!email) {
        console.warn("⚠️ EmailConsumer received invalid message", message);
        return;
      }

      console.log("📧 Sending welcome email to:", email);
      await sendWelcomeEmail(email, name);
    });
  }
}

module.exports = EmailConsumer;
