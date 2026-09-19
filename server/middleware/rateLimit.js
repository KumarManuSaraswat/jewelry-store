// Per-process protection for this single-instance store. Use a shared store when scaling horizontally.
export function rateLimit({ max = 30, windowMs = 15 * 60 * 1000 } = {}) {
  const buckets = new Map();
  const cleanup = setInterval(() => {
    for (const [ip, entry] of buckets)
      if (entry.reset <= Date.now()) buckets.delete(ip);
  }, windowMs);
  cleanup.unref();
  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip;
    let bucket = buckets.get(ip);
    if (!bucket || bucket.reset <= now) {
      bucket = { count: 0, reset: now + windowMs };
      buckets.set(ip, bucket);
    }
    bucket.count++;
    if (bucket.count > max) {
      res.setHeader("Retry-After", Math.ceil((bucket.reset - now) / 1000));
      return res
        .status(429)
        .json({ message: "Too many attempts. Please try again later." });
    }
    next();
  };
}
