const buckets = new Map();

function createRateLimiter({ windowMs, max }) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const key = `${req.method}:${req.originalUrl}:${ip}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        status: "fail",
        error: "Too many requests. Please try again later.",
      });
    }

    return next();
  };
}

// Keep the bucket map from growing forever by pruning stale entries.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt + 60000 < now) {
      buckets.delete(key);
    }
  }
}, 60000).unref();

module.exports = {
  loginLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 10 }),
  authLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 30 }),
};
