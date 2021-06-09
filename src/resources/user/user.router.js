var express = require("express");
var { getUser, updateUser } = require("./user.controllers");
var { isAuthenticated } = require("../../utils/auth");

var router = express.Router();

router.use(isAuthenticated);

router.get("/", getUser);
router.put("/", updateUser);

module.exports = router;
