// Import the dotenv package
require('dotenv').config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// A function to verify the token received from the frontend 
// Import the employee service 
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }
    // console.log("Here is the decoded token");
    // console.log(decoded);
    req.employee_email = decoded.employee_email;
    next();
  });
}

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const employee_email = req.employee_email;
    const employee = await employeeService.getEmployeeByEmail(employee_email);
    if (employee && employee.length > 0 && employee[0].company_role_id == 3) {
      next();
    } else {
      return res.status(403).send({
        status: "fail",
        error: "Not an Admin!"
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      error: "Internal server error"
    });
  }
}

// Admin (3) or Manager (2) — matches PrivateAuthRoute for add-customer
const isAdminOrManager = async (req, res, next) => {
  try {
    const employee_email = req.employee_email;
    const employee = await employeeService.getEmployeeByEmail(employee_email);
    if (employee && employee.length > 0) {
      const roleId = employee[0].company_role_id;
      if (roleId == 3 || roleId == 2) {
        return next();
      }
    }
    return res.status(403).send({
      status: "fail",
      error: "Not authorized!",
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      error: "Internal server error"
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isAdminOrManager,
}

module.exports = authMiddleware;