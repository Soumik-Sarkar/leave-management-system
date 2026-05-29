require("dotenv").config();

const { consumeNotifications } = require("./config/rabbitmq");

const startServer = async () => {
  await consumeNotifications();

  console.log("Notification Service Running");
};

startServer();
