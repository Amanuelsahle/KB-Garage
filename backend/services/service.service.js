// Import the query function from the db.config.js file
const conn = require("../config/db.config");

// check if service exists function
async function checkIfServiceExists(service_name) {
  // Changed placeholder from "?" to "$1"
  const query = "SELECT * FROM common_services WHERE service_name = $1";
  const rows = await conn.query(query, [service_name]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// add service function
async function addService(serviceData) {
  // Changed placeholders to "$1, $2" AND appended "RETURNING service_id"
  const query =
    "INSERT INTO common_services (service_name, service_description) VALUES ($1, $2) RETURNING service_id";
  const rows = await conn.query(query, [
    serviceData.service_name,
    serviceData.service_description,
  ]);

  // In our custom PostgreSQL pool configuration, if the insert succeeds, rows will have a length of 1
  if (rows.length !== 1) {
    return false;
  }

  // Extract the newly generated sequence ID directly out of the row object
  return { service_id: rows[0].service_id };
}

async function getAllServices() {
  // No variable arguments here, completely compatible with PostgreSQL syntax out of the box
  const query =
    "SELECT service_id, service_name, service_description FROM common_services ORDER BY service_name ASC";
  const rows = await conn.query(query);
  return rows;
}

module.exports = {
  checkIfServiceExists,
  addService,
  getAllServices,
};