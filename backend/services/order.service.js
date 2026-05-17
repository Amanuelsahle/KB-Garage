const crypto = require("crypto");
const { query, withTransaction } = require("../config/db.config");

/** Latest status per order: 1 = Received, 2 = In progress, 3 = Completed */
const ORDER_STATUS = Object.freeze({
  RECEIVED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
});

async function getAllOrdersForList() {
  // Query 1: Cleaned up and fully compatible with PostgreSQL. 
  // No variable arguments here, but standard subqueries run perfectly on Supabase.
  const sql = `
    SELECT
      o.order_id,
      o.order_date,
      o.employee_id,
      cif.customer_first_name,
      cif.customer_last_name,
      cid.customer_email,
      cid.customer_phone_number,
      v.vehicle_year,
      v.vehicle_make,
      v.vehicle_model,
      v.vehicle_tag,
      v.vehicle_serial,
      eif.employee_first_name AS received_by_first_name,
      eif.employee_last_name AS received_by_last_name,
      COALESCE(
        (
          SELECT os.order_status
          FROM order_status os
          WHERE os.order_id = o.order_id
          ORDER BY os.order_status_id DESC
          LIMIT 1
        ),
        1
      ) AS order_status
    FROM orders o
    INNER JOIN customer_identifier cid ON o.customer_id = cid.customer_id
    INNER JOIN customer_info cif ON cid.customer_id = cif.customer_id
    INNER JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    INNER JOIN employee e ON o.employee_id = e.employee_id
    INNER JOIN employee_info eif ON e.employee_id = eif.employee_id
    ORDER BY o.order_id DESC
  `;
  return query(sql, []);
}

async function vehicleBelongsToCustomer(vehicleId, customerId) {
  // Changed placeholders from "?" to "$1" and "$2"
  const rows = await query(
    "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_id = $1 AND customer_id = $2 LIMIT 1",
    [vehicleId, customerId],
  );
  return Array.isArray(rows) && rows.length > 0;
}

async function createOrder(payload) {
  const employeeId = parseInt(payload.employee_id, 10);
  const customerId = parseInt(payload.customer_id, 10);
  const vehicleId = parseInt(payload.vehicle_id, 10);
  const serviceIds = Array.isArray(payload.service_ids)
    ? payload.service_ids.map((id) => parseInt(id, 10)).filter((n) => Number.isFinite(n))
    : [];
  const orderTotalPrice = parseInt(payload.order_total_price, 10);
  const additionalRequest =
    payload.additional_request != null ? String(payload.additional_request) : "";
  const notesInternal =
    payload.notes_for_internal_use != null
      ? String(payload.notes_for_internal_use)
      : "";
  const notesCustomer =
    payload.notes_for_customer != null ? String(payload.notes_for_customer) : "";

  if (!Number.isFinite(employeeId) || employeeId < 1) {
    return { ok: false, error: "Invalid employee_id" };
  }
  if (!Number.isFinite(customerId) || customerId < 1) {
    return { ok: false, error: "Invalid customer_id" };
  }
  if (!Number.isFinite(vehicleId) || vehicleId < 1) {
    return { ok: false, error: "Invalid vehicle_id" };
  }
  if (serviceIds.length === 0) {
    return { ok: false, error: "At least one service is required" };
  }
  if (!Number.isFinite(orderTotalPrice) || orderTotalPrice < 0) {
    return { ok: false, error: "Invalid order_total_price" };
  }

  const belongs = await vehicleBelongsToCustomer(vehicleId, customerId);
  if (!belongs) {
    return { ok: false, error: "Vehicle does not belong to this customer" };
  }

  const orderHash = crypto.randomBytes(24).toString("hex");

  try {
    const orderId = await withTransaction(async (conn) => {
      // 1. Appended "RETURNING order_id" to capture the row in Postgres
      // 2. Changed placeholders to numbered layout $1, $2, $3, $4
      const [rows] = await conn.execute(
        `INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash)
         VALUES ($1, $2, $3, 1, $4) RETURNING order_id`,
        [employeeId, customerId, vehicleId, orderHash],
      );

      // Extract the dynamic key from our compatibility wrapper array's first row object
      const newOrderId = Number(rows[0].order_id);

      // Changed placeholders to $1, $2, $3, $4, $5
      await conn.execute(
        `INSERT INTO order_info (
          order_id, order_total_price, additional_request,
          notes_for_internal_use, notes_for_customer, additional_requests_completed
        ) VALUES ($1, $2, $3, $4, $5, 0)`,
        [newOrderId, orderTotalPrice, additionalRequest, notesInternal, notesCustomer],
      );

      // Changed placeholders to $1, $2
      await conn.execute(
        "INSERT INTO order_status (order_id, order_status) VALUES ($1, 1)",
        [newOrderId],
      );

      // Loop queries start tracking parameters over from $1 and $2 respectively
      for (const sid of serviceIds) {
        await conn.execute(
          "INSERT INTO order_services (order_id, service_id, service_completed) VALUES ($1, $2, 0)",
          [newOrderId, sid],
        );
      }

      return newOrderId;
    });

    return { ok: true, order_id: orderId };
  } catch (err) {
    console.log(err);
    return { ok: false, error: "Failed to create order" };
  }
}

async function updateOrderStatus(orderId, orderStatus) {
  const id = parseInt(orderId, 10);
  const status = parseInt(orderStatus, 10);
  const allowed = new Set([
    ORDER_STATUS.RECEIVED,
    ORDER_STATUS.IN_PROGRESS,
    ORDER_STATUS.COMPLETED,
  ]);

  if (!Number.isFinite(id) || id < 1) {
    return { ok: false, error: "Invalid order id" };
  }
  if (!Number.isFinite(status) || !allowed.has(status)) {
    return {
      ok: false,
      error: "Invalid order_status (allowed: 1 Received, 2 In progress, 3 Completed)",
    };
  }

  // Changed placeholder to $1
  const exists = await query(
    "SELECT order_id FROM orders WHERE order_id = $1 LIMIT 1",
    [id],
  );
  if (!exists || exists.length === 0) {
    return { ok: false, error: "Order not found" };
  }

  try {
    // Changed placeholders to $1, $2
    await query(
      "INSERT INTO order_status (order_id, order_status) VALUES ($1, $2)",
      [id, status],
    );
    return { ok: true, order_id: id, order_status: status };
  } catch (err) {
    console.log(err);
    return { ok: false, error: "Failed to update order status" };
  }
}

module.exports = {
  ORDER_STATUS,
  getAllOrdersForList,
  createOrder,
  updateOrderStatus,
};