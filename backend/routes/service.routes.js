const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");

router.get("/api/services", serviceController.getAllServices);

router.post("/api/services", serviceController.addService);

module.exports = router;
