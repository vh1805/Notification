class BasePublisher {
  constructor(queue, channel) {
    this.queue = queue;
    this.channel = channel;
  }

  async publish(message, options = {}) {
    if (!this.channel) {
      throw new Error("❌ Channel not initialized");
    }

    if (options.delayMs && Number.isInteger(options.delayMs) && options.delayMs > 0) {
      return this.publishDelayed(message, options.delayMs);
    }

    try {
      await this.channel.assertQueue(this.queue, { durable: true });

      const payload = {
        data: message,
        createdAt: new Date(),
      };

      const isSent = this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true },
      );

      if (!isSent) {
        console.warn(`⚠️ Buffer full for ${this.queue}`);
      }

      console.log(`📤 Sent to ${this.queue} - ${isSent}`);
    } catch (err) {
      console.error(`❌ Failed to publish to ${this.queue}`, err);
    }
  }

  async publishDelayed(message, delayMs) {
    const delayQueue = `${this.queue}_delay`;

    try {
      await this.channel.assertQueue(delayQueue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "",
          "x-dead-letter-routing-key": this.queue,
        },
      });

      const payload = {
        data: message,
        createdAt: new Date(),
        delayed: true,
      };

      const isSent = this.channel.sendToQueue(
        delayQueue,
        Buffer.from(JSON.stringify(payload)),
        {
          persistent: true,
          expiration: String(delayMs),
        },
      );

      if (!isSent) {
        console.warn(`⚠️ Buffer full for ${delayQueue}`);
      }

      console.log(`⏳ Scheduled message to ${this.queue} after ${delayMs}ms`);
    } catch (err) {
      console.error(`❌ Failed to publish delayed message to ${delayQueue}`, err);
    }
  }
}

module.exports = BasePublisher;
