const CircuitBreaker = require("opossum");

const axios = require("axios");

const employeeServiceRequest = async (employeeId, token) => {
  const response = await axios.get(
    `${process.env.EMPLOYEE_SERVICE_URL}/employees/${employeeId}/balance`,
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return response.data;
};

const deductLeaveBalance = async (employeeId, leaveType, days, token) => {
  return await axios.put(
    `${process.env.EMPLOYEE_SERVICE_URL}/employees/${employeeId}/deduct-balance`,
    {
      leaveType,
      days,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  );
};

const options = {
  timeout: 5000,

  errorThresholdPercentage: 50,

  resetTimeout: 10000,
};

const breaker = new CircuitBreaker(employeeServiceRequest, options);

breaker.fallback(() => {
  return {
    success: false,
    message: "Employee Service temporarily unavailable",
  };
});

breaker.on("open", () => {
  console.log("[CIRCUIT BREAKER] Employee Service DOWN");
});

breaker.on("halfOpen", () => {
  console.log("[CIRCUIT BREAKER] Trying Employee Service again...");
});

breaker.on("close", () => {
  console.log("[CIRCUIT BREAKER] Employee Service restored");
});

const deductBalanceBreaker = new CircuitBreaker(deductLeaveBalance, options);

deductBalanceBreaker.fallback(() => {
  return {
    success: false,
    message: "Unable to deduct leave balance right now",
  };
});

module.exports = {
  breaker,
  deductBalanceBreaker,
};
