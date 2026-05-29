require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/db");

const { connectRabbitMQ } = require("./config/rabbitmq");

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  await connectDB();
  await connectRabbitMQ();
  app.listen(PORT, () => {
    console.log(`Leave Service running on port ${PORT}`);
  });
};

startServer();
