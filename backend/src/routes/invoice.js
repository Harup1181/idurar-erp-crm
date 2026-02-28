import express from 'express';
import { InvoiceRepository } from '../repositories/InvoiceRepository.js';
import { requireAuth } from '../middleware/auth.js';
import { handleSupabaseError } from '../lib/supabase.js';

const router = express.Router();

// Get all invoices
router.get('/', requireAuth, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      clientId: req.query.clientId,
    };
    const invoices = await InvoiceRepository.findAll(req.user.id, filters);
    res.json(invoices);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get invoice statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await InvoiceRepository.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get overdue invoices
router.get('/overdue', requireAuth, async (req, res) => {
  try {
    const invoices = await InvoiceRepository.findOverdue(req.user.id);
    res.json(invoices);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get invoice by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const invoice = await InvoiceRepository.findById(req.params.id);
    res.json(invoice);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Create new invoice
router.post('/', requireAuth, async (req, res) => {
  try {
    const invoice = await InvoiceRepository.create({
      ...req.body,
      adminId: req.user.id,
    });
    res.status(201).json(invoice);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Update invoice
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const invoice = await InvoiceRepository.update(req.params.id, req.body);
    res.json(invoice);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Delete invoice
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await InvoiceRepository.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

export default router;
