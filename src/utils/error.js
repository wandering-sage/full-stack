function sendError(res, message = "Request Failed", code = 400){
    return res.status(code).json({
        error: message
    }).end();
}

module.exports = sendError;