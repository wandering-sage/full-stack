var express = require("express");

var cntrl = require("./appointment.controllers");
const { isAuthenticated, isAdmin } = require("../../utils/auth");

var router = express.Router();

// /api/appointment
router
	.route("/")
	.get(isAuthenticated, cntrl.getMany)
	.post(isAuthenticated, isAdmin, cntrl.createOne);

// /api/appointment/:id
router
	.route("/:id")
	.get(isAuthenticated, cntrl.getOne)
	.put(isAuthenticated, isAdmin, cntrl.updateOne)
	.delete(isAuthenticated, cntrl.removeOne);

module.exports = router;
