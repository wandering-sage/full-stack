var Service = require("./service.model");
var { genericGetMany, genericCreateOne } = require("../../utils/crud");
var sendError = require("../../utils/error");

var createOne = genericCreateOne(Service);

async function getMany(req, res) {
	try {
		// var docs = await Service.find().lean().populate({path: "cate", select: "color name"}).exec();
		var docs = await Service.find().lean().populate("category").sort({category: 1}).exec();
		if (!docs) {
			return sendError(res, "Not found in DB", 404);
		}
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
	// docs.map(d=>d.color = d.cate[0].color);

	return res.status(200).json({ data: docs });
}

async function getOne(req, res) {
	try {
		var { id } = req.params;
		// var doc = await Service.findOne({ _id: id }).lean().populate({path: "cate", select: "color name"}).exec();
		var doc = await Service.findOne({ _id: id }).lean().populate("category").exec();
		if (!doc) {
			return sendError(res, "Not  found in DB", 404);
		}
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
	// doc.color=doc.cate[0].color;
	return res.status(200).json({ data: doc });
}

// FIXME: implement category logic
async function updateOne(req, res) {
	try {
		var { id, categoryId } = req.params;
		var updatedDoc = await Service.findOneAndUpdate(
			{ _id: id, category: categoryId },
			req.body,
			{ new: true }
		).exec();
		if (!updatedDoc) {
			sendError(res, "Not  found in DB", 404);
		}
		res.status(200).json({ data: updatedDoc });
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
}

async function removeOne(req, res) {
	try {
		var { id, categoryId } = req.params;
		var doc = await Service.findOneAndRemove({ _id: id, category: categoryId }).exec();
		if (!doc) {
			sendError(res, "Not  found in DB", 404);
		}
		res.status(200).json({ data: doc });
	} catch (e) {
		console.error(e);
		return sendError(res);
	}
}


module.exports = {getMany, getOne, removeOne, updateOne, createOne}