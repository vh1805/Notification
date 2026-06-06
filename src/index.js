const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const { connectDB } = require("./connection/db");
const ConsumerFactory = require("./RabbitMQ/ConsumerFactory");

dotenv.config();

const startConsumers = async () => {
  try {
    const emailConsumer = await ConsumerFactory.create("EMAIL");
    await emailConsumer.start();

    const notificationConsumer = await ConsumerFactory.create("NOTIFICATION");
    await notificationConsumer.start();

    console.log("✅ RabbitMQ consumers started");
  } catch (err) {
    console.error("RabbitMQ consumer startup failed:", err);
  }
};

connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    startConsumers();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
