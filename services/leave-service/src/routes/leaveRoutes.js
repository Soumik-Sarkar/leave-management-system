const express = require("express");

const router = express.Router();

const leaveController = require("../controllers/leaveController");

const authenticateToken = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /leaves:
 *   post:
 *     summary: Apply for leave
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave applied successfully
 *       400:
 *         description: Validation failed
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("EMPLOYEE"),
  leaveController.applyLeave,
);

/**
 * @swagger
 * /leaves/{leaveId}/approve:
 *   put:
 *     summary: Approve leave request
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave approved successfully
 *       400:
 *         description: Invalid leave request
 */
router.put(
  "/:leaveId/approve",
  authenticateToken,
  authorizeRoles("MANAGER"),
  leaveController.approveLeave,
);

/**
 * @swagger
 * /leaves/{leaveId}/reject:
 *   put:
 *     summary: Reject leave request
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 */
router.put(
  "/:leaveId/reject",
  authenticateToken,
  authorizeRoles("MANAGER"),
  leaveController.rejectLeave,
);

/**
 * @swagger
 * /leaves/history/{employeeId}:
 *   get:
 *     summary: Get leave history
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave history fetched successfully
 */
router.get(
  "/history/:employeeId",
  authenticateToken,
  leaveController.getLeaveHistory,
);

/**
 * @swagger
 * /leaves/manager/{managerId}:
 *   get:
 *     summary: Get leave requests for manager's team members
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Manager employee ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *         description: Filter by leave status
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leaves starting from date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leaves up to date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Manager leave requests fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get(
  "/manager/:managerId",
  authenticateToken,
  authorizeRoles("MANAGER"),
  leaveController.getManagerLeaves,
);

/**
 * @swagger
 * /leaves/{leaveId}/cancel:
 *   put:
 *     summary: Cancel leave request
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave cancelled successfully
 */
router.put(
  "/:leaveId/cancel",
  authenticateToken,
  authorizeRoles("EMPLOYEE"),
  leaveController.cancelLeave,
);

module.exports = router;
