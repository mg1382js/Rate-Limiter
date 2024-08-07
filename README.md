# RateLimiter
RateLimiter is a simple tool to limit the number of requests to a server from a specific IP address within a defined time window. It helps prevent abuse and overloading of the server.

## Features
- Limits the number of requests from an IP address
- Configurable time window and request limit
- Easy to integrate with Node.js HTTP server
## Installation
This project does not require any external dependencies and can be run with Node.js.

## Usage
1. Copy the Code
   First, save the following code in a file named rateLimiter.js:

```js
class RateLimiter {
constructor({ windowSizeInSeconds, maxRequests }) {
this.windowSizeInMillis = windowSizeInSeconds * 1000;
this.maxRequests = maxRequests;
this.requests = new Map();
}

    isAllowed(ip) {
        const currentTime = Date.now();
        if (!this.requests.has(ip)) {
            this.requests.set(ip, []);
        }

        const requestTimes = this.requests.get(ip);
        // Remove outdated request timestamps
        while (requestTimes.length > 0 && requestTimes[0] <= currentTime - this.windowSizeInMillis) {
            requestTimes.shift();
        }

        if (requestTimes.length < this.maxRequests) {
            requestTimes.push(currentTime);
            return true;
        } else {
            return false;
        }
    }

    handleRequest(req, res, next) {
        const ip = req.connection.remoteAddress || req.socket.remoteAddress;
        if (this.isAllowed(ip)) {
            next();
        } else {
            res.writeHead(429, { 'Content-Type': 'text/plain' });
            res.end('Too Many Requests');
        }
    }
}

// Usage Example with Node.js HTTP server

const http = require('http');
const rateLimiter = new RateLimiter({ windowSizeInSeconds: 60, maxRequests: 10 });

http.createServer((req, res) => {
rateLimiter.handleRequest(req, res, () => {
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end('Request allowed');
});
}).listen(3000, () => {
console.log('Server running at http://localhost:3000');
});
```
2. Run the Server
   To start the server, run the following command in your terminal:

```bash
node rateLimiter.js
The server will run on port 3000, and you can access it in your browser at http://localhost:3000.
```
## Adding New Routes
To add new routes and handlers, modify the example server code. Simply add new routes and their corresponding handlers to the server's request handling logic.

## Method Descriptions
isAllowed(ip): Checks if a request from the given IP address is allowed based on the rate limit.
handleRequest(req, res, next): Middleware function to handle incoming requests, checking the rate limit and either allowing the request or returning a "Too Many Requests" response.