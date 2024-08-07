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

module.exports = RateLimiter;