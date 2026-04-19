const router = require("express").Router();
const { employeeLogin } = require("../../controllers/employeeAuthController");

router.post("/employee-login", employeeLogin);
module.exports = router;
