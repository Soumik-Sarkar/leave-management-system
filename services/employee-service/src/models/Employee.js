const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    managerId: {
      type: String,
      default: null,
    },

    leaveBalances: {
      casual: {
        type: Number,
        default: 12,
      },

      sick: {
        type: Number,
        default: 10,
      },

      privilege: {
        type: Number,
        default: 15,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Employee", employeeSchema);
