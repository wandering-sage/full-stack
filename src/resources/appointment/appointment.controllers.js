var Appointment = require("./appointment.model");
var { genericUpdateOne } = require("../../utils/crud");
var sendError = require("../../utils/error");

var updateOne = genericUpdateOne(Appointment);

async function createOne(req, res) {
	try {
		var doc = await model.create({ ...req.body, madeBy: req.user._id });
		return res.status(201).json({ data: doc });
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
}

async function getOne(req, res) {
	try {
		var id = req.params.id;
		var userId = req.user._id;
		var doc = await Appointment.findOne({ _id: id, madeBy: userId }).exec();
		if (!doc) {
			return sendError(res, "Not  found in DB", 404);
		}
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
	return res.status(200).json({ data: doc });
}

// Gets all the appointments from this user
async function getMany(req, res) {
	try {
		var docs = await Appointment.find({ madeBy: req.user._id }).exec();
		if (!docs) {
			return sendError(res, "Not  found in DB", 404);
		}
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
	return res.status(200).json({ data: docs });
}

async function removeOne(req, res) {
	try {
		var id = req.params.id;
		var userId = req.user._id;
		var doc = await Appointment.findOneAndRemove({ _id: id, madeBy: userId }).exec();
		if (!doc) {
			return sendError(res, "Not  found in DB", 404);
		}
		res.status(200).json({ data: doc });
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
}

module.exports = { getMany, getOne, removeOne, updateOne, createOne };
