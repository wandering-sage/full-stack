var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema(
	{
		madeBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		startTime: {
			type: Date,
			required: true,
		},
		duration: {
			type: Number,
		},
		endTime: Date,
		status: {
			type: String,
			required: true,
			enum: ["active", "complete", "waiting"],
			default: "waiting",
		},
		services: {
			type: [mongoose.SchemaTypes.ObjectId],
			ref: "Service",
			required: true,
		},
		amount: Number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
