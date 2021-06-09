var mongoose = require("mongoose");

var serviceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
			unique: true,
		},
		image: {
			type: String,
			requireed: true,
		},
		category: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Category",
			required: true,
		},
		cost: {
			type: Number,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

// serviceSchema.virtual("cate", {
// 	ref: "Category",
// 	localField: "category",
// 	foreignField: "name"
// })

module.exports = mongoose.model("Service", serviceSchema);
