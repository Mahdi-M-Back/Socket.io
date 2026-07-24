import rateLimit from "express-rate-limit";

// General limiter applied to all traffic.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter dedicated to /login - the actual brute-force /
// credential-stuffing target, kept independent of general API traffic.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
});
