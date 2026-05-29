const leaveService = require("../services/leaveService");

const applyLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.applyLeave({
      ...req.body,
      token: req.headers.authorization,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.approveLeave(
      req.params.leaveId,
      req.headers.authorization,
    );

    res.status(200).json({
      success: true,
      message: "Leave approved",
      data: leave,
    });
  } catch (error) {
    console.log("APPROVE ERROR:", error);

    next(error);
  }
};

const rejectLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.rejectLeave(
      req.params.leaveId,
      req.body.rejectionReason,
    );

    res.status(200).json({
      success: true,
      message: "Leave rejected",
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

const getLeaveHistory = async (req, res, next) => {
  try {
    if (
      req.user.role === "EMPLOYEE" &&
      req.user.employeeId !== req.params.employeeId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const history = await leaveService.getLeaveHistory(
      req.params.employeeId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const getManagerLeaves = async (req, res, next) => {
  try {
    if (req.user.employeeId !== req.params.managerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    const leaves = await leaveService.getManagerLeaves(
      req.params.managerId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

const cancelLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.cancelLeave(req.params.leaveId, req.user);

    res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  approveLeave,
  rejectLeave,
  getManagerLeaves,
  getLeaveHistory,
  cancelLeave,
};
