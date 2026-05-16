//  import service service
const serviceService = require("../services/service.service");
// add service controller
async function addService(req, res) {
  // check if the service is already exists
  const serviceExists = await serviceService.checkIfServiceExists(
    req.body.service_name,
  );
  if (serviceExists) {
    return res.status(400).json({
      error: "This service is already exists!",
    });
  }
  try {
    const serviceData = req.body;
    // add service by using service service
    const service = await serviceService.addService(serviceData);
    if (!service) {
      res.status(400).json({
        error: "Failed to add the service!",
      });
    } else {
      res.status(200).json({
        status: true,
        data: service,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
}

async function getAllServices(req, res) {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json({
      status: "success",
      data: services,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
}

module.exports = {
  addService,
  getAllServices,
};
