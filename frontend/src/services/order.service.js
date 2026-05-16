const api_url = process.env.REACT_APP_API_URL;

const getOrders = async () => {
  return fetch(`${api_url}/api/orders`, { method: "GET" });
};

const createOrder = async (body) => {
  return fetch(`${api_url}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

const updateOrderStatus = async (orderId, orderStatus) => {
  return fetch(`${api_url}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_status: orderStatus }),
  });
};

const orderService = {
  getOrders,
  createOrder,
  updateOrderStatus,
};

export default orderService;
