const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/api/orders", orderController.getAllOrders);
router.post("/api/orders", orderController.createOrder);
router.patch(
  "/api/orders/:orderId/status",
  orderController.updateOrderStatus,
);

module.exports = router;
