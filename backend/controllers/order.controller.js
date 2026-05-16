const orderService = require("../services/order.service");

async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrdersForList();
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

async function createOrder(req, res) {
  try {
    const result = await orderService.createOrder(req.body || {});
    if (!result.ok) {
      return res.status(400).json({ error: result.error || "Bad request" });
    }
    res.status(200).json({
      status: true,
      data: { order_id: result.order_id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const result = await orderService.updateOrderStatus(
      req.params.orderId,
      req.body?.order_status,
    );
    if (!result.ok) {
      const code = result.error === "Order not found" ? 404 : 400;
      return res.status(code).json({ error: result.error || "Bad request" });
    }
    res.status(200).json({
      status: "success",
      data: {
        order_id: result.order_id,
        order_status: result.order_status,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
};
