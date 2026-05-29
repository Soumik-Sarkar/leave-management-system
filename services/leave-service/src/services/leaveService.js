const { getChannel } = require("../config/rabbitmq");
const Leave = require("../models/Leave");
const { breaker, deductBalanceBreaker } = require("../utils/circuitBreaker");
const AppError = require("../utils/AppError");

const applyLeave = async (leaveData) => {
  const { employeeId, leaveType, startDate, endDate, days } = leaveData;

  const today = new Date();

  if (new Date(startDate) < today) {
    throw new AppError("Past dates are not allowed", 400);
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new AppError("Start date cannot be after end date", 400);
  }

  const balanceResponse = await breaker.fire(employeeId, leaveData.token);

  if (!balanceResponse.success) {
    throw new AppError("Employee Service unavailable", 503);
  }

  const balances = balanceResponse.data;

  const leaveKey = leaveType.toLowerCase();

  if (balances[leaveKey] < days) {
    throw new AppError("Insufficient leave balance", 400);
  }

  const overlappingLeave = await Leave.findOne({
    employeeId,

    status: {
      $in: ["PENDING", "APPROVED"],
    },

    $or: [
      {
        startDate: {
          $lte: endDate,
        },

        endDate: {
          $gte: startDate,
        },
      },
    ],
  });

  if (overlappingLeave) {
    throw new AppError("Overlapping leave request exists", 400);
  }

  const leave = await Leave.create(leaveData);

  const channel = getChannel();

  if (!channel) {
    throw new AppError("RabbitMQ channel unavailable", 500);
  }

  channel.sendToQueue(
    "leave_notifications",
    Buffer.from(
      JSON.stringify({
        type: "LEAVE_APPLIED",
        employeeId,
        managerId: leave.managerId,
        leaveType,
        days,
        status: "PENDING",
        message: `Leave applied by ${employeeId}`,
      }),
    ),
  );

  return leave;
};

const approveLeave = async (leaveId, token) => {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new AppError("Leave not found", 400);
  }

  if (leave.status !== "PENDING") {
    throw new AppError("Only pending leaves can be approved", 400);
  }

  await deductBalanceBreaker.fire(
    leave.employeeId,
    leave.leaveType,
    leave.days,
    token,
  );

  leave.status = "APPROVED";

  await leave.save();

  const channel = getChannel();

  channel.sendToQueue(
    "leave_notifications",
    Buffer.from(
      JSON.stringify({
        type: "LEAVE_APPROVED",
        employeeId: leave.employeeId,
        leaveId: leave._id,
        leaveType: leave.leaveType,
        days: leave.days,
        status: "APPROVED",
        message: `Leave approved for ${leave.employeeId}`,
      }),
    ),
  );

  return leave;
};

const rejectLeave = async (leaveId, rejectionReason) => {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new AppError("Leave not found", 400);
  }

  if (leave.status !== "PENDING") {
    throw new AppError("Only pending leaves can be rejected", 400);
  }

  leave.status = "REJECTED";

  leave.rejectionReason = rejectionReason;

  await leave.save();

  const channel = getChannel();

  channel.sendToQueue(
    "leave_notifications",
    Buffer.from(
      JSON.stringify({
        type: "LEAVE_REJECTED",
        employeeId: leave.employeeId,
        leaveId: leave._id,
        leaveType: leave.leaveType,
        status: "REJECTED",
        rejectionReason,
        message: `Leave rejected for ${leave.employeeId}`,
      }),
    ),
  );

  return leave;
};

const cancelLeave = async (leaveId, user) => {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new AppError("Leave not found", 404);
  }

  if (leave.employeeId !== user.employeeId) {
    throw new AppError("Access denied", 403);
  }

  if (leave.status !== "PENDING") {
    throw new AppError("Only pending leaves can be cancelled", 400);
  }

  leave.status = "CANCELLED";

  await leave.save();

  const channel = getChannel();

  if (channel) {
    channel.sendToQueue(
      "leave_notifications",
      Buffer.from(
        JSON.stringify({
          type: "LEAVE_CANCELLED",
          employeeId: leave.employeeId,
          leaveId: leave._id,
          message: `Leave cancelled by ${leave.employeeId}`,
        }),
      ),
    );
  }

  return leave;
};

const getLeaveHistory = async (employeeId, queryParams) => {
  const { status, page = 1, limit = 5 } = queryParams;

  const query = {
    employeeId,
  };

  if (status) {
    query.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const leaves = await Leave.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Leave.countDocuments(query);

  return {
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    leaves,
  };
};

const getManagerLeaves = async (managerId, queryParams) => {
  const {
    status,
    employeeId,
    startDate,
    endDate,
    page = 1,
    limit = 5,
  } = queryParams;

  const query = {
    managerId,
  };

  if (status) {
    query.status = status;
  }

  if (employeeId) {
    query.employeeId = employeeId;
  }

  if (startDate && endDate) {
    query.startDate = {
      $gte: new Date(startDate),
    };

    query.endDate = {
      $lte: new Date(endDate),
    };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const leaves = await Leave.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Leave.countDocuments(query);

  return {
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    leaves,
  };
};

module.exports = {
  applyLeave,
  approveLeave,
  rejectLeave,
  getLeaveHistory,
  getManagerLeaves,
  cancelLeave,
};
