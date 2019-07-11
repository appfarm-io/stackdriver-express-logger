const onFinished = require('on-finished')
const onHeaders = require('on-headers')
const stream = process.stdout

const getResponseTimeInSeconds = (req, res) => {
	if (!req._startAt || !res._startAt) {
		// missing request and/or response start time
		return
	}

	// calculate diff
	var seconds = res._startAt[0] - req._startAt[0] + (res._startAt[1] - req._startAt[1]) * 1e-9

	return seconds.toFixed(6)
}

/**
 * Record the start time.
 * @private
 */

function recordStartTime() {
	this._startAt = process.hrtime()
	this._startTime = new Date()
}

const getLogLine = (req, res) => {
	const httpRequest = {
		requestMethod: req.method,
		requestUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
		requestSize: req.connection.bytesRead,
		status: res.statusCode,
		responseSize: res.getHeader('Content-Length'),
		userAgent: req.headers['user-agent'],
		remoteIp: req.ip,
		referer: req.get('Referrer'),
		latency: getResponseTimeInSeconds(req, res) + 's',
		protocol: `${req.protocol}/${req.httpVersion}`,
	}

	return JSON.stringify({ httpRequest })
}

const stackdriverRequestLogger = (req, res, next) => {
	// request data
	req._startAt = undefined
	req._startTime = undefined

	// response data
	res._startAt = undefined
	res._startTime = undefined

	// record request start
	recordStartTime.call(req)

	function logRequest() {
		var line = getLogLine(req, res)
		stream.write(line + '\n')
	}

	// record response start
	onHeaders(res, recordStartTime)

	// log when response finished
	onFinished(res, logRequest)

	next()
}

module.exports = stackdriverRequestLogger
