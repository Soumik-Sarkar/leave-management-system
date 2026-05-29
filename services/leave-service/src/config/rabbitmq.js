const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  let retries = 5;

  while (retries) {
    try {
      const connection = await amqp.connect("amqp://rabbitmq:5672");

      channel = await connection.createChannel();

      await channel.assertQueue("leave_notifications");

      console.log("RabbitMQ Connected");

      break;
    } catch (error) {
      console.log("RabbitMQ connection failed. Retrying...");

      retries -= 1;

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

const getChannel = () => channel;

module.exports = {
  connectRabbitMQ,
  getChannel,
};
