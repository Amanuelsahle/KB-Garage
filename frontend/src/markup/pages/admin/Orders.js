import React, { useCallback, useEffect, useState } from "react";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import OrdersTable from "../../components/Admin/Orders/OrdersTable";
import orderService from "../../../services/order.service";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    return orderService
      .getOrders()
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || data.message || "Could not load orders.");
          setOrders([]);
          return;
        }
        setOrders(Array.isArray(data.data) ? data.data : []);
        setError(null);
      })
      .catch(() => {
        setError("Could not load orders.");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusError(null);
    setUpdatingOrderId(orderId);
    const res = await orderService.updateOrderStatus(orderId, newStatus);
    const data = await res.json().catch(() => ({}));
    setUpdatingOrderId(null);
    if (!res.ok) {
      setStatusError(data.error || "Could not update order status.");
      return false;
    }
    setOrders((prev) =>
      prev.map((o) =>
        Number(o.order_id) === Number(orderId)
          ? { ...o, order_status: newStatus }
          : o,
      ),
    );
    return true;
  };

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <section className="contact-section orders-admin-section">
            <div className="auto-container inner-padding">
              <div className="contact-title">
                <h2>Orders</h2>
              </div>
              {loading && (
                <p className="text-muted" role="status">
                  Loading orders…
                </p>
              )}
              {!loading && error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {!loading && !error && statusError && (
                <div className="alert alert-warning" role="alert">
                  {statusError}
                </div>
              )}
              {!loading && !error && (
                <OrdersTable
                  orders={orders}
                  onStatusChange={handleStatusChange}
                  updatingOrderId={updatingOrderId}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Orders;
