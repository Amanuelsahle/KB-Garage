// import customer service
const customerService = require("../services/customer.service");

// create add customer controller
async function createCustomer(req, res, next) {
  // check is the customer is exist by phone number and email
  const customerExists = await customerService.checkIfCustomerExists(
    req.body.customer_phone_number,
    req.body.customer_email,
  );
  // If customer exists, send a response to the client
  if (customerExists) {
    res.status(400).json({
      error: "This customer is already registered!",
    });
  } else {
    try {
      const customerData = req.body;
      //    create customer by using customer service
      const customer = await customerService.createCustomer(customerData);
      if (!customer) {
        res.status(400).json({
          error: "Failed to create customer!",
        });
      } else {
        res.status(200).json({
          status: true,
          data: customer,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Something went wrong!",
      });
    }
  }
}

// create getAllCustomers controller
async function getAllCustomers(req, res, next) {
  // get all customers from the database
  const customers = await customerService.getAllCustomers();
  if (!customers) {
    res.status(400).json({
      error: "Failed to get all customers!",
    });
  } else {
    // send the customers to the client
    res.status(200).json({
      status: "success",
      data: customers,
    });
  }
}

async function getCustomerById(req, res) {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId,
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
}

async function getCustomerVehicles(req, res) {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId,
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const vehicles = await customerService.getVehiclesByCustomerId(
      req.params.customerId,
    );
    res.status(200).json({
      status: "success",
      data: vehicles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
}

async function addCustomerVehicle(req, res) {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId,
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const b = req.body || {};
    const requiredFields = [
      "vehicle_year",
      "vehicle_make",
      "vehicle_model",
      "vehicle_type",
      "vehicle_mileage",
      "vehicle_tag",
      "vehicle_serial",
      "vehicle_color",
    ];
    for (const field of requiredFields) {
      if (
        b[field] === undefined ||
        b[field] === null ||
        String(b[field]).trim() === ""
      ) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    const year = parseInt(b.vehicle_year, 10);
    const mileage = parseInt(b.vehicle_mileage, 10);
    if (!Number.isFinite(year) || !Number.isFinite(mileage)) {
      return res.status(400).json({
        error: "vehicle_year and vehicle_mileage must be valid numbers",
      });
    }
    const vehicle = await customerService.addVehicle(req.params.customerId, {
      vehicle_year: year,
      vehicle_make: String(b.vehicle_make).trim(),
      vehicle_model: String(b.vehicle_model).trim(),
      vehicle_type: String(b.vehicle_type).trim(),
      vehicle_mileage: mileage,
      vehicle_tag: String(b.vehicle_tag).trim(),
      vehicle_serial: String(b.vehicle_serial).trim(),
      vehicle_color: String(b.vehicle_color).trim(),
    });
    if (!vehicle) {
      return res.status(400).json({ error: "Failed to add vehicle" });
    }
    res.status(200).json({
      status: true,
      data: vehicle,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
}

async function updateCustomerStatus(req, res) {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId,
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const active = req.body?.active_customer_status;
    const ok = await customerService.updateCustomerActiveStatus(
      req.params.customerId,
      active,
    );
    if (!ok) {
      return res.status(400).json({
        error: "Invalid active_customer_status (use 0 or 1)",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        customer_id: Number(req.params.customerId),
        active_customer_status: parseInt(active, 10),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

async function deleteCustomer(req, res) {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId,
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const ok = await customerService.softDeleteCustomer(req.params.customerId);
    if (!ok) {
      return res.status(400).json({ error: "Could not delete customer" });
    }
    res.status(200).json({
      status: "success",
      message: "Customer marked as inactive",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

async function updateCustomer(req, res) {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId,
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const b = req.body || {};
    const requiredFields = [
      "customer_first_name",
      "customer_last_name",
      "customer_phone_number",
      "active_customer_status"
    ];
    for (const field of requiredFields) {
      if (b[field] === undefined || b[field] === null || String(b[field]).trim() === "") {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    
    const ok = await customerService.updateCustomerInfo(req.params.customerId, {
      customer_first_name: String(b.customer_first_name).trim(),
      customer_last_name: String(b.customer_last_name).trim(),
      customer_phone_number: String(b.customer_phone_number).trim(),
      active_customer_status: parseInt(b.active_customer_status, 10),
    });
    
    if (!ok) {
      return res.status(400).json({ error: "Could not update customer" });
    }
    
    res.status(200).json({
      status: "success",
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerVehicles,
  addCustomerVehicle,
  updateCustomerStatus,
  deleteCustomer,
  updateCustomer,
};
