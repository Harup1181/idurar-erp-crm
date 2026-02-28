import express from 'express';
import { ClientRepository } from '../repositories/ClientRepository.js';
import { requireAuth } from '../middleware/auth.js';
import { handleSupabaseError } from '../lib/supabase.js';

const router = express.Router();

// Get all clients
router.get('/', requireAuth, async (req, res) => {
  try {
    const clients = await ClientRepository.findAll(req.user.id);
    res.json(clients);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get clients with stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const clients = await ClientRepository.findAllWithStats(req.user.id);
    res.json(clients);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Search clients
router.get('/search/:query', requireAuth, async (req, res) => {
  try {
    const clients = await ClientRepository.search(req.params.query, req.user.id);
    res.json(clients);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get client by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const client = await ClientRepository.findById(req.params.id);
    res.json(client);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Create new client
router.post('/', requireAuth, async (req, res) => {
  try {
    const client = await ClientRepository.create({
      ...req.body,
      adminId: req.user.id,
    });
    res.status(201).json(client);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Update client
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const client = await ClientRepository.update(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Delete client
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await ClientRepository.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

export default router;
