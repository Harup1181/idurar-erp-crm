import { supabaseAdmin, supabase } from '../lib/supabase.js';

export class PaymentRepository {
  // Create new payment
  static async create(paymentData) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert({
        invoice_id: paymentData.invoiceId,
        admin_id: paymentData.adminId,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod,
        payment_date: paymentData.paymentDate,
        reference_number: paymentData.referenceNumber,
        notes: paymentData.notes,
        status: paymentData.status || 'completed',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all payments
  static async findAll(adminId = null) {
    let query = supabase.from('payments').select(`
      *,
      invoice:invoices(*)
    `);

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query.order('payment_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Get payment by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoice:invoices(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get payments for invoice
  static async findByInvoiceId(invoiceId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update payment
  static async update(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .update({
        amount: updateData.amount,
        payment_method: updateData.paymentMethod,
        payment_date: updateData.paymentDate,
        reference_number: updateData.referenceNumber,
        notes: updateData.notes,
        status: updateData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete payment
  static async delete(id) {
    const { error } = await supabaseAdmin.from('payments').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // Get payment statistics
  static async getStats(adminId) {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .eq('admin_id', adminId);

    if (error) throw error;

    const stats = {
      totalPayments: 0,
      totalAmount: 0,
      paymentCount: data.length,
      averagePayment: 0,
    };

    if (data.length > 0) {
      stats.totalAmount = data.reduce((sum, p) => sum + (p.amount || 0), 0);
      stats.averagePayment = stats.totalAmount / data.length;
      stats.totalPayments = stats.totalAmount;
    }

    return stats;
  }

  // Get payments by date range
  static async findByDateRange(startDate, endDate, adminId = null) {
    let query = supabase
      .from('payments')
      .select('*')
      .gte('payment_date', startDate)
      .lte('payment_date', endDate);

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query.order('payment_date', { ascending: false });
    if (error) throw error;
    return data;
  }
}
