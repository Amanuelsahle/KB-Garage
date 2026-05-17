// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");
// A function to check if customer exists in the database if one of customer phone or customer email is exists
async function checkIfCustomerExists(customer_phone_number, customer_email) {
  const query =
    "SELECT * FROM customer_identifier WHERE customer_phone_number = $1 OR customer_email = $2";
  const rows = await conn.query(query, [customer_phone_number, customer_email]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new customer
async function createCustomer(customer) {
  let createdCustomer = {};
  try {
    // Generate salt and hash the customer email
    const salt = await bcrypt.genSalt(10);
    const customer_hash = await bcrypt.hash(customer.customer_email, salt);
    const query =
      "INSERT INTO customer_identifier (customer_phone_number, customer_email, customer_hash) VALUES ($1, $2, $3) RETURNING customer_id";
    const rows = await conn.query(query, [
      customer.customer_phone_number,
      customer.customer_email,
      customer_hash,
    ]);
    if (rows.length !== 1) {
      return false;
    }
    const customer_id = rows[0].customer_id;
    const activeStatus =
      customer.active_customer_status !== undefined &&
      customer.active_customer_status !== null
        ? customer.active_customer_status
        : 1;
    const query2 =
      "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES ($1, $2, $3, $4)";
    const rows2 = await conn.query(query2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      activeStatus,
    ]);
    // if rows2 didn't throw an error, it succeeded
    createdCustomer = {
      customer_id: customer_id,
    };
  } catch (err) {
    console.log(err);
    return false;
  }
  return createdCustomer;
}

// create getAllCustomers service
async function getAllCustomers() {
  const query =
    "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id ORDER BY customer_identifier.customer_id DESC limit 10";
  const rows = await conn.query(query);
  return rows;
}

async function getCustomerById(customerId) {
  const id = parseInt(customerId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return null;
  }
  const query =
    "SELECT customer_identifier.customer_id, customer_identifier.customer_email, customer_identifier.customer_phone_number, customer_identifier.customer_added_date, customer_info.customer_first_name, customer_info.customer_last_name, customer_info.active_customer_status FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_id = $1";
  const rows = await conn.query(query, [id]);
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows[0];
}

async function getVehiclesByCustomerId(customerId) {
  const id = parseInt(customerId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return [];
  }
  const query =
    "SELECT vehicle_id, customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color FROM customer_vehicle_info WHERE customer_id = $1 ORDER BY vehicle_id DESC";
  return conn.query(query, [id]);
}

async function addVehicle(customerId, vehicle) {
  const id = parseInt(customerId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return false;
  }
  const query =
    "INSERT INTO customer_vehicle_info (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING vehicle_id";
  const rows = await conn.query(query, [
    id,
    vehicle.vehicle_year,
    vehicle.vehicle_make,
    vehicle.vehicle_model,
    vehicle.vehicle_type,
    vehicle.vehicle_mileage,
    vehicle.vehicle_tag,
    vehicle.vehicle_serial,
    vehicle.vehicle_color,
  ]);
  if (rows.length !== 1) {
    return false;
  }
  return { vehicle_id: rows[0].vehicle_id };
}

async function updateCustomerActiveStatus(customerId, activeStatus) {
  const id = parseInt(customerId, 10);
  const s = parseInt(activeStatus, 10);
  if (!Number.isFinite(id) || id < 1) {
    return false;
  }
  if (s !== 0 && s !== 1) {
    return false;
  }
  const rows = await conn.query(
    "UPDATE customer_info SET active_customer_status = $1 WHERE customer_id = $2",
    [s, id],
  );
  return true;
}

async function softDeleteCustomer(customerId) {
  return updateCustomerActiveStatus(customerId, 0);
}

async function updateCustomerInfo(customerId, customer) {
  const id = parseInt(customerId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return false;
  }

  try {
    const query1 =
      "UPDATE customer_identifier SET customer_phone_number = $1 WHERE customer_id = $2";
    await conn.query(query1, [customer.customer_phone_number, id]);

    const query2 =
      "UPDATE customer_info SET customer_first_name = $1, customer_last_name = $2, active_customer_status = $3 WHERE customer_id = $4";
    await conn.query(query2, [
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status,
      id,
    ]);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// export the functions
module.exports = {
  checkIfCustomerExists,
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getVehiclesByCustomerId,
  addVehicle,
  updateCustomerActiveStatus,
  softDeleteCustomer,
  updateCustomerInfo,
};
