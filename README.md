# stackdriver-express-logger

Middleware for express that will output Stackdriver compatible logs to stdout. When used in Google Kubernetes, stackdriver will parse the output.

It will report the following parameters:

-   method
-   url
-   request size
-   status code
-   response size
-   user agent
-   remote ip
-   referer
-   latency

## Usage

```js
const stackdriverExpressLogger = require('@appfarm/stackdriver-express-logger')
```

### Express Sample App

```js
const express = require('express')
const stackdriverExpressLogger = require('@appfarm/stackdriver-express-logger')

const app = express()

app.use(stackdriverExpressLogger)

app.get('/', function(req, res) {
	res.send('hello, world!')
})
```
