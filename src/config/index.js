var { merge } = require("lodash");
var config = require("./dev");
var env = process.env.NODE_ENV || "development";

var baseConfig = {
	env,
	isDev: env === "development",
	isTest: env === "testing",
	port: 3000,
	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: "100d",
	},
};

var envConfig = config;

module.exports = merge(baseConfig, envConfig);
