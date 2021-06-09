var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
			unique: true,
		},
		color: {
			type: String,
			required: true,
			unique: true,
			default: "#000000"
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);