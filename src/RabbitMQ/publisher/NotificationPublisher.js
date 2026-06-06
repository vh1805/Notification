const BasePublisher = require("./BasePublisher");

class NotificationPublisher extends BasePublisher {
  constructor(channel) {
    super("notification_queue", channel);
  }
}

module.exports = NotificationPublisher;
