const BaseConsumer = require("./BaseConsumer");

class NotificationConsumer extends BaseConsumer {
  constructor(channel) {
    super("notification_queue", channel);
  }

  async start() {
    await this.consume(async (message) => {
      console.log("🔔 Notification:", message);
    });
  }
}

module.exports = NotificationConsumer;
