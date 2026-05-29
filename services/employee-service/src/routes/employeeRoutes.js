const express = require("express");

const router = express.Router();

const employeeController = require("../controllers/employeeController");

const authenticateToken = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create employee
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Employee created successfully
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("MANAGER"),
  employeeController.createEmployee,
);

/**
 * @swagger
 * /employees/{employeeId}/balance:
 *   get:
 *     summary: Get employee leave balance
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave balance fetched successfully
 *       404:
 *         description: Employee not found
 */
router.get(
  "/:employeeId/balance",
  authenticateToken,
  employeeController.getLeaveBalance,
);

/**
 * @swagger
 * /employees/manager/{managerId}:
 *   get:
 *     summary: Get team members of manager
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team members fetched successfully
 */
router.get(
  "/manager/:managerId",
  authenticateToken,
  authorizeRoles("MANAGER"),
  employeeController.getTeamMembers,
);

/**
 * @swagger
 * /employees/{employeeId}/deduct-balance:
 *   put:
 *     summary: Deduct leave balance
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave balance deducted successfully
 */
router.put(
  "/:employeeId/deduct-balance",
  authenticateToken,
  authorizeRoles("MANAGER"),
  employeeController.deductLeaveBalance,
);

module.exports = router;
