// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// check if service exists function
async function checkIfServiceExists(service_name) {
  const query = "SELECT * FROM common_services WHERE service_name = ?";
  const rows = await conn.query(query, [service_name]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// add service function
async function addService(serviceData) {
  const query =
    "INSERT INTO common_services (service_name, service_description) VALUES (?, ?)";
  const rows = await conn.query(query, [
    serviceData.service_name,
    serviceData.service_description,
  ]);
  if (rows.affectedRows !== 1) {
    return false;
  }
  return { service_id: rows.insertId };
}

async function getAllServices() {
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
