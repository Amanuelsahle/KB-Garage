const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

router.get(
  "/api/services",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  serviceController.getAllServices,
);

router.post(
  "/api/services",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager, authLimiter],
  serviceController.addService,
);

module.exports = router;
