class BaseConsumer {
  constructor(queue, channel) {
    this.queue = queue;
    this.channel = channel;
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async consume(handler) {
    if (!this.channel) {
      throw new Error("❌ Channel not initialized");
    }

    await this.channel.assertQueue(this.queue, { durable: true });

    this.channel.consume(this.queue, async (msg) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        const content = payload.data ?? payload;

        await handler(content);

        this.channel.ack(msg);
      } catch (err) {
        console.error(`❌ Error processing ${this.queue}`, err);

        const retries = msg.properties.headers?.["x-retries"] || 0;
        const maxRetries = 5;

        if (retries < maxRetries) {
          const delayMs = 1000 * 2 ** retries; // 1s, 2s, 4s, 8s, 16s
          const delayQueue = `${this.queue}_delay`;

          await this.channel.assertQueue(delayQueue, {
            durable: true,
            arguments: {
              "x-dead-letter-exchange": "",
              "x-dead-letter-routing-key": this.queue,
            },
          });

          this.channel.sendToQueue(delayQueue, msg.content, {
            persistent: true,
            expiration: String(delayMs),
            headers: { "x-retries": retries + 1 },
          });

          console.log(
            `⏳ Retrying ${this.queue} in ${delayMs / 1000}s (${retries + 1}/${maxRetries})`,
          );
          this.channel.ack(msg);
        } else {
          const failedQueue = `${this.queue}_failed`;
          await this.channel.assertQueue(failedQueue, { durable: true });
          this.channel.sendToQueue(failedQueue, msg.content, {
            persistent: true,
            headers: msg.properties.headers,
          });

          console.log(`⚠️ Max retries reached, moving message to ${failedQueue}`);
          this.channel.ack(msg);
        }
      }
    });

    console.log(`👂 Listening on ${this.queue}`);
  }
}

module.exports = BaseConsumer;
