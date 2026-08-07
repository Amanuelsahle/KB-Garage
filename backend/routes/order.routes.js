const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

router.get(
  "/api/orders",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  orderController.getAllOrders,
);
router.post(
  "/api/orders",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager, authLimiter],
  orderController.createOrder,
);
router.patch(
  "/api/orders/:orderId/status",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  orderController.updateOrderStatus,
);

module.exports = router;
