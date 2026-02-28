import { getAdminUser } from '../lib/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const user = await getAdminUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const user = await getAdminUser(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};
