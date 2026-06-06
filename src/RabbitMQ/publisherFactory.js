const { connectToRabbitMQ } = require("./connection");
const EmailPublisher = require("./publisher/EmailPublisher");
const NotificationPublisher = require("./publisher/NotificationPublisher");

class PublisherFactory {
  static async create(type) {
    const channel = await connectToRabbitMQ();

    switch (type) {
      case "EMAIL":
        return new EmailPublisher(channel);

      case "NOTIFICATION":
        return new NotificationPublisher(channel);

      default:
        throw new Error("Invalid publisher type");
    }
  }
}

module.exports = PublisherFactory;
