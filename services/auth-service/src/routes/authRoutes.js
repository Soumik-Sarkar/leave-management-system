const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/**
 * @swagger
 * /auth/manager-only:
 *   get:
 *     summary: Manager-only route
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manager access granted
 *       403:
 *         description: Access denied
 */
router.get(
  "/manager-only",
  authenticateToken,
  authorizeRoles("MANAGER"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Manager",
    });
  },
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

module.exports = router;
