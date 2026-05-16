const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// import customer comtriller
const customerController = require("../controllers/customer.controller");
// import auth middleware
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add customer request on post
router.post(
  "/api/customer",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  customerController.createCustomer,
);
// Create a route to handle the get all customers request on get
router.get(
  "/api/customers",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  customerController.getAllCustomers,
);
// Customer profile & vehicles (no auth middleware)
router.get(
  "/api/customers/:customerId",
  customerController.getCustomerById,
);
router.get(
  "/api/customers/:customerId/vehicles",
  customerController.getCustomerVehicles,
);
router.post(
  "/api/customers/:customerId/vehicles",
  customerController.addCustomerVehicle,
);
router.patch(
  "/api/customers/:customerId",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  customerController.updateCustomerStatus,
);
router.delete(
  "/api/customers/:customerId",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrManager],
  customerController.deleteCustomer,
);
router.put(
  "/api/customer/edit/:customerId",
  customerController.updateCustomer
);
// Export the router
module.exports = router;
