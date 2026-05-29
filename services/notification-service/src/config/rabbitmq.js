const amqp = require("amqplib");

const consumeNotifications = async () => {
  try {
    const connection = await amqp.connect("amqp://rabbitmq:5672");

    const channel = await connection.createChannel();

    await channel.assertQueue("leave_notifications");

    console.log("Notification Service Connected to RabbitMQ");

    channel.consume("leave_notifications", (message) => {
      const data = JSON.parse(message.content.toString());

      switch (data.type) {
        case "LEAVE_APPLIED":
          console.log(
            `[NOTIFICATION] Leave Applied | Employee: ${data.employeeId}`,
          );
          break;

        case "LEAVE_APPROVED":
          console.log(
            `[NOTIFICATION] Leave Approved | Employee: ${data.employeeId}`,
          );
          break;

        case "LEAVE_REJECTED":
          console.log(
            `[NOTIFICATION] Leave Rejected | Employee: ${data.employeeId} | Reason: ${data.rejectionReason}`,
          );
          break;

        case "LEAVE_CANCELLED":
          console.log(
            `[NOTIFICATION] Leave Cancelled | Employee: ${data.employeeId}`,
          );
          break;

        case "SYSTEM_ERROR":
          console.log(`[SYSTEM ERROR] ${data.message}`);
          break;

        default:
          console.log("[UNKNOWN EVENT]", data);
      }

      channel.ack(message);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  consumeNotifications,
};
