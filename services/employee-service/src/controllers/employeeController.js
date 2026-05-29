const employeeService = require("../services/employeeService");

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

const getLeaveBalance = async (req, res, next) => {
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

    const balances = await employeeService.getLeaveBalance(
      req.params.employeeId,
    );

    res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    next(error);
  }
};

const getTeamMembers = async (req, res, next) => {
  try {
    const members = await employeeService.getTeamMembers(req.params.managerId);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

const deductLeaveBalance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const { leaveType, days } = req.body;

    const balances = await employeeService.deductLeaveBalance(
      employeeId,
      leaveType,
      days,
    );

    res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getLeaveBalance,
  getTeamMembers,
  deductLeaveBalance,
};
