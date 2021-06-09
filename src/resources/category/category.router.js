var express = require("express");

var cntrl = require("./category.controllers");
const { isAuthenticated, isAdmin } = require("../../utils/auth");

var router = express.Router();

// /api/category
router
	.route("/")
	.get(cntrl.getMany)
	.post(isAuthenticated, isAdmin, cntrl.createOne);

// /api/category/:id
router
	.route("/:id")
	.get(cntrl.getOne)
	.put(isAuthenticated, isAdmin, cntrl.updateOne)
	.delete(isAuthenticated, isAdmin, cntrl.removeOne);

module.exports = router;
