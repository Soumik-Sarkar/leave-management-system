const express = require("express");

const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
  createProxyMiddleware({
    target: process.env.LEAVE_SERVICE_URL,
    changeOrigin: true,

    onError: (err, req, res) => {
      console.error("Proxy Error:", err.message);

      res.status(500).json({
        success: false,
        message: "Proxy error",
        error: err.message,
      });
    },
  }),
);

module.exports = router;
