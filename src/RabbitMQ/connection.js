const amqp = require("amqplib");

let connection = null;
let channel = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectToRabbitMQ = async () => {
  if (!process.env.RABBITMQ_URL) {
    throw new Error("Missing RABBITMQ_URL environment variable");
  }

  if (channel) {
    return channel;
  }

  while (!channel) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);

      connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
      });

      connection.on("close", () => {
        console.error("RabbitMQ connection closed. Attempting to reconnect...");
        channel = null;
      });

      channel = await connection.createChannel();
      console.log("Connected to RabbitMQ");
      return channel;
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      await delay(5000);
    }
  }
};

module.exports = {
  connectToRabbitMQ,
};
