// rateLimiter.js
const rateMap = new Map();

export function rateLimiter(req, res, next) {
  const userIP = req.ip;

  const currentTime = Date.now();
  const windowTime = 15 * 60 * 1000; // 15 minutes
  const limit = 100;

  if (!rateMap.has(userIP)) {
    rateMap.set(userIP, { count: 1, startTime: currentTime });
    return next();
  }

  let { count, startTime } = rateMap.get(userIP);

  // Reset window after 15 minutes
  if (currentTime - startTime > windowTime) {
    rateMap.set(userIP, { count: 1, startTime: currentTime });
    return next();
  }

  if (count >= limit) {
    return res.status(429).json({ error: "Too many requests" });
  }

  rateMap.set(userIP, { count: count + 1, startTime });
  next();
}
