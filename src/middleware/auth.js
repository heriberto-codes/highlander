const crypto = require('crypto');

const TOKEN_TTL_MS = Number(process.env.AUTH_TOKEN_TTL_MS) || 1000 * 60 * 60 * 12;
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-only-change-me';

const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 1000 * 60 * 15;
const LOGIN_MAX_ATTEMPTS = 10;

function sign(value) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(value).digest('hex');
}

function issueToken(coachId) {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${coachId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const coachId = Number(parts[0]);
  const expiresAt = Number(parts[1]);
  const signature = parts[2];
  if (!Number.isInteger(coachId) || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }

  const payload = `${coachId}.${expiresAt}`;
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return valid ? { coachId } : null;
}

function getToken(req) {
  const authHeader = req.get('authorization') || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7);
  }
  return req.get('x-auth-token');
}

function requireAuth(req, res, next) {
  const token = getToken(req);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.authCoachId = decoded.coachId;
  next();
}

function loginRateLimit(req, res, next) {
  const key = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = loginAttempts.get(key) || { count: 0, resetAt: now + LOGIN_WINDOW_MS };

  if (attempt.resetAt <= now) {
    attempt.count = 0;
    attempt.resetAt = now + LOGIN_WINDOW_MS;
  }

  if (attempt.count >= LOGIN_MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((attempt.resetAt - now) / 1000);
    return res.status(429).json({
      message: 'Too many login attempts. Try again later.',
      retryAfter
    });
  }

  req.loginRate = { key, attempt };
  next();
}

function trackFailedLogin(req) {
  if (!req.loginRate) return;
  req.loginRate.attempt.count += 1;
  loginAttempts.set(req.loginRate.key, req.loginRate.attempt);
}

function clearLoginFailures(req) {
  if (!req.loginRate) return;
  loginAttempts.delete(req.loginRate.key);
}

module.exports = {
  issueToken,
  requireAuth,
  loginRateLimit,
  trackFailedLogin,
  clearLoginFailures
};
