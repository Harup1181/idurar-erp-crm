import express from 'express';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { InvoiceRepository } from '../repositories/InvoiceRepository.js';
import { requireAuth } from '../middleware/auth.js';
import { handleSupabaseError } from '../lib/supabase.js';

const router = express.Router();

// Get all payments
router.get('/', requireAuth, async (req, res) => {
  try {
    const payments = await PaymentRepository.findAll(req.user.id);
    res.json(payments);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get payment statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await PaymentRepository.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get payments by date range
router.get('/date-range', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const payments = await PaymentRepository.findByDateRange(startDate, endDate, req.user.id);
    res.json(payments);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get payments by invoice
router.get('/invoice/:invoiceId', requireAuth, async (req, res) => {
  try {
    const payments = await PaymentRepository.findByInvoiceId(req.params.invoiceId);
    res.json(payments);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Get payment by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const payment = await PaymentRepository.findById(req.params.id);
    res.json(payment);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Create new payment
router.post('/', requireAuth, async (req, res) => {
  try {
    const payment = await PaymentRepository.create({
      ...req.body,
      adminId: req.user.id,
    });

    // Update invoice status if fully paid
    const invoice = await InvoiceRepository.findById(req.body.invoiceId);
    if (invoice) {
      const payments = await PaymentRepository.findByInvoiceId(invoice.id);
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      
      if (totalPaid >= invoice.total_amount) {
        await InvoiceRepository.update(invoice.id, { status: 'paid' });
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Update payment
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const payment = await PaymentRepository.update(req.params.id, req.body);
    res.json(payment);
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

// Delete payment
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await PaymentRepository.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    const { error: errMsg, status } = handleSupabaseError(error);
    res.status(status).json({ error: errMsg });
  }
});

export default router;
