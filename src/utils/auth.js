var config = require("../config");
var User = require("../resources/user/user.model");
var jwt = require("jsonwebtoken");
var sendError = require("./error");
const {validationResult } = require('express-validator');

function newToken(user) {
	return jwt.sign({ id: user.id }, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp,
	});
}

function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) return reject(err);
			resolve(payload);
		});
	});
}

async function signup(req, res) {
	var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, errors.array()[0].msg);
    }

	try {
		var user = await User.create(req.body);
		var token = newToken(user);
		return res.status(201).send({ token });
	} catch (e) {
		console.error(e);
		return sendError(res, e);
	}
}

async function signin(req, res) {
	var { email, password } = req.body;

	var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, errors.array()[0].msg);
    }

	try {
		var user = await User.findOne({ email: email }).select("email password").exec();
		if (!user) {
			return sendError(res, "Email not found", 401);
		}

		var match = await user.checkPassword(password);
		if (!match) {
			return sendError(res, "Wrong Password", 401);
		}

		const token = newToken(user);
		return res.status(201).send({ token });
        
	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
}

async function isAuthenticated(req, res, next) {
	var bearer = req.headers.authorization;

	if (!bearer || !bearer.startsWith("Bearer ")) {
		return sendError(res, "Not authorized");
	}

	var token = bearer.split("Bearer ")[1].trim();
	var payload;
	try {
		payload = await verifyToken(token);
	} catch (e) {
		return sendError(res, "ACCESS DENIED", 403);
	}

	var user = await User.findById(payload.id).select("-password").lean().exec();

	if (!user) {
		return sendError(res, "ACCESS DENIED", 403);
	}

	req.user = user;
	next();
}

// role must be 100 for admin
function isAdmin(req, res, next) {
	if (!req.user || req.user.role !== 100) {
		return sendError(res, "You are not ADMIN, Access denied", 403);
	}
	next();
}

module.exports = { signin, signup, isAuthenticated, isAdmin };
