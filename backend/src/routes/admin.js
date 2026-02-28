import express from 'express';
import { AdminRepository } from '../repositories/AdminRepository.js';
import { requireAuth } from '../middleware/auth.js';
import { handleSupabaseError } from '../lib/supabase.js';

const router = express.Router();

// Get all admins (admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const admins = await AdminRepository.findAll();
    res.json(admins);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get current admin
router.get('/me', requireAuth, async (req, res) => {
  try {
    const admin = await AdminRepository.findByUserId(req.user.id);
    res.json(admin);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get admin by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const admin = await AdminRepository.findById(req.params.id);
    res.json(admin);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Create new admin
router.post('/', requireAuth, async (req, res) => {
  try {
    const admin = await AdminRepository.create(req.body);
    res.status(201).json(admin);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Update admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const admin = await AdminRepository.update(req.params.id, req.body);
    res.json(admin);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Delete admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await AdminRepository.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

export default router;
