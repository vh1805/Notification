const BasePublisher = require("./BasePublisher");

class EmailPublisher extends BasePublisher {
  constructor(channel) {
    super("email_queue", channel);
  }
}

module.exports = EmailPublisher;
