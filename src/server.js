var express = require("express");
var { json, urlencoded } = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");
var { check } = require("express-validator");
var config = require("./config");
var { connect } = require("./utils/db");

var { signup, signin } = require("./utils/auth");
var appointmentRouter = require("./resources/appointment/appointment.router");
var categoryRouter = require("./resources/category/category.router");
var serviceRouter = require("./resources/service/service.router");
var userRouter = require("./resources/user/user.router");
var {isAuthenticated} = require("./utils/auth");

var app = express();

// To remove this from header(added by express)
app.disable("x-powered-by");

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

// -------------------------------------------Client Routes--------------------------------------------------

app.use("/", express.static(__dirname+"/frontEnd/"));

// -------------------------------------------API routes------------------------------------------------------
app.post(
	"/api/signup",
	[
		check("email", "Valid email is required").isEmail(),
		check("password", "password should be at least 3 char").isLength({ min: 5 }),
	],
	signup
);
app.post(
	"/api/signin",
	[
		check("email", "Valid email is required").isEmail(),
		check("password", "password field is required").isLength({ min: 1 }),
	],
	signin
);

app.use("/api/appointment", appointmentRouter);
app.use("/api/category", categoryRouter);
app.use("/api/service", serviceRouter);
app.use("/api/user", userRouter);

// To start the server
async function start() {
	try {
		// connects to db
		await connect();

		app.listen(config.port, () => {
			console.log(`Running at http://localhost:${config.port}/`);
		});
	} catch (e) {
		console.error(e);
	}
}

module.exports = { app, start };
