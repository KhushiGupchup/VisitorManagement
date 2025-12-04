const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes protected
router.use(authMiddleware);

// Dashboard stats
router.get("/dashboard", AdminController.dashboard);

// Add employee
router.post("/add-employee", AdminController.addEmployee);

// List employees
router.get("/employees", AdminController.getEmployees);

// List visitors
router.get("/visitors", AdminController.getVisitors);

router.delete("/employee/:empId", AdminController.deleteEmployee);


module.exports = router;
