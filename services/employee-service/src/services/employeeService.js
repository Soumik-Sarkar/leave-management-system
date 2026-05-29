const Employee = require("../models/Employee");

const AppError = require("../utils/AppError");

const createEmployee = async (employeeData) => {
  const existingEmployee = await Employee.findOne({
    $or: [
      { email: employeeData.email },
      { employeeId: employeeData.employeeId },
    ],
  });

  if (existingEmployee) {
    throw new AppError("Employee already exists", 400);
  }

  const employee = await Employee.create(employeeData);

  return employee;
};

const getLeaveBalance = async (employeeId) => {
  const employee = await Employee.findOne({
    employeeId,
  });

  if (!employee) {
    throw new AppError("Employee not found", 400);
  }

  return employee.leaveBalances;
};

const getTeamMembers = async (managerId) => {
  return await Employee.find({
    managerId,
  });
};

const deductLeaveBalance = async (employeeId, leaveType, days) => {
  const employee = await Employee.findOne({
    employeeId,
  });

  if (!employee) {
    throw new AppError("Employee not found", 400);
  }

  const leaveKey = leaveType.toLowerCase();

  if (employee.leaveBalances[leaveKey] < days) {
    throw new AppError("Insufficient leave balance", 400);
  }

  employee.leaveBalances[leaveKey] -= days;

  await employee.save();

  return employee.leaveBalances;
};

module.exports = {
  createEmployee,
  getLeaveBalance,
  getTeamMembers,
  deductLeaveBalance,
};
