// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");

// A function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
  // Changed "?" to "$1"
  const query = "SELECT * FROM employee WHERE employee_email = $1";
  const rows = await conn.query(query, [email]);

  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    // Changed "?" to "$1, $2" AND added "RETURNING employee_id" to mimic insertId behavior
    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES ($1, $2) RETURNING employee_id";
    const rows = await conn.query(query, [
      employee.employee_email,
      employee.active_employee,
    ]);


    // PostgreSQL wrapper returns rows directly. If the array is empty, the insert failed.
    if (rows.length !== 1) {
      return false;
    }

    // Get the employee id from the returning clause row data
    const employee_id = rows[0].employee_id;

    // Changed all remaining insert query question marks to numbered placeholders ($1, $2, etc.)
    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES ($1, $2, $3, $4)";
    const rows2 = await conn.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);

    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES ($1, $2)";
    const rows3 = await conn.query(query3, [employee_id, hashedPassword]);

    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES ($1, $2)";
    const rows4 = await conn.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);

    // construct the employee object to return
    createdEmployee = {
      employee_id: employee_id,
    };
  } catch (err) {
    console.log(err);
  }
  // Return the employee object
  return createdEmployee;
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  // Changed "?" to "$1"
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = $1";
  const rows = await conn.query(query, [employee_email]);
  return rows;
}

// A function to get all employees
async function getAllEmployees() {
  // No variable arguments here, but changed LIMIT syntax keyword convention to standard lowercase matching your style
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC LIMIT 10";
  const rows = await conn.query(query);
  return rows;
}

// edit employee information(name, phone, role, status)
async function updateEmployeeInfo(employeeId, employee) {
  const id = parseInt(employeeId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return false;
  }
  try {
    // Note how each separate query starts over at indexing parameters from $1 onwards
    const query1 =
      "UPDATE employee_info SET employee_first_name = $1, employee_last_name = $2, employee_phone = $3 WHERE employee_id = $4";
    await conn.query(query1, [
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
      id,
    ]);

    const query2 =
      "UPDATE employee_role SET company_role_id = $1 WHERE employee_id = $2";
    await conn.query(query2, [employee.company_role_id, id]);

    const query3 =
      "UPDATE employee SET active_employee = $1 WHERE employee_id = $2";
    await conn.query(query3, [employee.active_employee, id]);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// get employee by id
async function getEmployeeById(employeeId) {
  // Changed "?" to "$1"
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id WHERE employee.employee_id = $1";
  const rows = await conn.query(query, [employeeId]);
  return rows;
}

// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeInfo,
};
