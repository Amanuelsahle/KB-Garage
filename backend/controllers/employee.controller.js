// Import the employee service
const employeeService = require("../services/employee.service");

// Create the add employee controller
async function createEmployee(req, res, next) {
  // console.log(req.headers);

  // Check if employee email already exists in the database
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email,
  );
  // If employee exists, send a response to the client
  if (employeeExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!",
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee || !employee.employee_id) {
        res.status(400).json({
          error: "Failed to add the employee!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

// get employee by id
async function getEmployeeById(req, res, next) {
  // Call the getEmployeeById method from the employee service
  const employee = await employeeService.getEmployeeById(req.params.employeeId);
  // console.log(employee);
  if (!employee) {
    res.status(400).json({
      error: "Failed to get the employee!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employee[0],
    });
  }
}

// Create the getAllEmployees controller
async function getAllEmployees(req, res, next) {
  // Call the getAllEmployees method from the employee service
  const employees = await employeeService.getAllEmployees();
  // console.log(employees);
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

// update employee info
async function updateEmployeeInfo(req, res) {
  try {
    const employeeData = req.body;
    const ok = await employeeService.updateEmployeeInfo(
      req.params.employeeId,
      employeeData,
    );
    if (!ok) {
      return res.status(400).json({ error: "Could not update employee" });
    }
    res.status(200).json({
      status: "success",
      data: { employee_id: req.params.employeeId },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

// Export the createEmployee controller
module.exports = {
  createEmployee,
  getAllEmployees,
  updateEmployeeInfo,
  getEmployeeById,
};
