const { connectToRabbitMQ } = require("./connection");
const EmailConsumer = require("./consumer/EmailConsumer");
const NotificationConsumer = require("./consumer/NotificationConsumer");

class ConsumerFactory {
  static async create(type) {
    const channel = await connectToRabbitMQ();

    switch (type) {
      case "EMAIL":
        return new EmailConsumer(channel);

      case "NOTIFICATION":
        return new NotificationConsumer(channel);

      default:
        throw new Error("Invalid consumer type");
    }
  }
}

module.exports = ConsumerFactory;
