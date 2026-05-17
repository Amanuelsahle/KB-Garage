import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { format, isValid } from "date-fns";

function formatOrderDate(raw) {
  if (raw == null || raw === "") return "—";
  const d = raw instanceof Date ? raw : new Date(raw);
  return isValid(d) ? format(d, "dd/MM/yyyy") : "—";
}

function statusLabel(code) {
  switch (Number(code)) {
    case 3:
      return "Completed";
    case 2:
      return "In progress";
    default:
      return "Received";
  }
}

function statusPillClass(code) {
  switch (Number(code)) {
    case 3:
      return "order-status-pill order-status-pill-completed";
    case 2:
      return "order-status-pill order-status-pill-progress";
    default:
      return "order-status-pill order-status-pill-received";
  }
}

function OrdersTable({ orders, onStatusChange, updatingOrderId }) {
  const [editingOrderId, setEditingOrderId] = useState(null);

  const toggleStatusEdit = (orderId) => {
    setEditingOrderId((prev) =>
      Number(prev) === Number(orderId) ? null : orderId,
    );
  };

  const handleStatusSelect = async (orderId, currentStatus, next) => {
    if (next === Number(currentStatus)) return;
    const ok = await onStatusChange(orderId, next);
    if (ok) setEditingOrderId(null);
  };

  if (!orders || orders.length === 0) {
    return (
      <p className="text-muted py-4 mb-0">No orders yet.</p>
    );
  }

  return (
    <Table striped bordered hover responsive className="orders-admin-table">
      <thead>
        <tr>
          <th>Order Id</th>
          <th>Customer</th>
          <th>Vehicle</th>
          <th>Order Date</th>
          <th>Received by</th>
          <th>Order status</th>
          <th>View/Edit</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((row) => {
          const receivedBy = [
            row.received_by_first_name,
            row.received_by_last_name,
          ]
            .filter(Boolean)
            .join(" ");
          const isEditingStatus =
            Number(editingOrderId) === Number(row.order_id);
          const isUpdating = updatingOrderId === row.order_id;

          return (
            <tr key={row.order_id}>
              <td>{row.order_id}</td>
              <td>
                <div className="orders-cell-stack">
                  <span>
                    {row.customer_first_name} {row.customer_last_name}
                  </span>
                  <span className="text-muted small">{row.customer_email}</span>
                  <span className="text-muted small">
                    {row.customer_phone_number}
                  </span>
                </div>
              </td>
              <td>
                <div className="orders-cell-stack">
                  <span>
                    {row.vehicle_make} {row.vehicle_model}
                  </span>
                  <span className="text-muted small">{row.vehicle_year}</span>
                  <span className="text-muted small">{row.vehicle_tag}</span>
                </div>
              </td>
              <td>{formatOrderDate(row.order_date)}</td>
              <td>{receivedBy || "—"}</td>
              <td className="orders-status-cell">
                {isEditingStatus ? (
                  <div className="orders-status-edit-wrap">
                    <Form.Select
                      size="sm"
                      className="orders-status-select"
                      value={Number(row.order_status)}
                      onChange={(e) =>
                        handleStatusSelect(
                          row.order_id,
                          row.order_status,
                          Number(e.target.value),
                        )
                      }
                      disabled={isUpdating}
                      aria-label={`Change status for order ${row.order_id}`}
                    >
                      <option value={1}>Received</option>
                      <option value={2}>In progress</option>
                      <option value={3}>Completed</option>
                    </Form.Select>
                    <button
                      type="button"
                      className="btn btn-link btn-sm orders-status-done p-0 mt-1"
                      onClick={() => setEditingOrderId(null)}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <span
                    className={statusPillClass(row.order_status)}
                    title="Click Edit to change status"
                  >
                    {statusLabel(row.order_status)}
                  </span>
                )}
              </td>
              <td>
                <div className="orders-action-icons">
                  <button
                    type="button"
                    className="btn btn-link p-0 me-2 text-secondary"
                    title="View (coming soon)"
                    aria-label="View order"
                  >
                    <i className="fas fa-external-link-alt" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-link p-0 ${isEditingStatus ? "text-danger" : "text-secondary"
                      }`}
                    title={
                      isEditingStatus
                        ? "Close status editor"
                        : "Edit order status"
                    }
                    aria-label={
                      isEditingStatus
                        ? "Close status editor"
                        : "Edit order status"
                    }
                    onClick={() => toggleStatusEdit(row.order_id)}
                  >
                    <i className="fas fa-edit" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default OrdersTable;
