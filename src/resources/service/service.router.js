var express = require("express");

var cntrl = require("./service.controllers");
const { isAuthenticated, isAdmin } = require("../../utils/auth");

var router = express.Router();

// /api/service
router
	.route("/")
	.get(cntrl.getMany)
	.post(cntrl.createOne);
	// .post(isAuthenticated, isAdmin, cntrl.createOne);

// /api/service/:id
router
	.route("/:id")
	.get(cntrl.getOne)
	.put(isAuthenticated, isAdmin, cntrl.updateOne)
	.delete(isAuthenticated, isAdmin, cntrl.removeOne);

module.exports = router;
