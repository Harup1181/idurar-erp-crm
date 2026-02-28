import { supabaseAdmin, supabase } from '../lib/supabase.js';

export class InvoiceRepository {
  // Create new invoice
  static async create(invoiceData) {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .insert({
        invoice_number: invoiceData.invoiceNumber,
        client_id: invoiceData.clientId,
        admin_id: invoiceData.adminId,
        issue_date: invoiceData.issueDate,
        due_date: invoiceData.dueDate,
        subtotal: invoiceData.subtotal,
        tax_amount: invoiceData.taxAmount,
        total_amount: invoiceData.totalAmount,
        currency: invoiceData.currency || 'USD',
        status: invoiceData.status || 'draft',
        notes: invoiceData.notes,
        items: invoiceData.items || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all invoices
  static async findAll(adminId = null, filters = {}) {
    let query = supabase.from('invoices').select(`
      *,
      client:clients(*)
    `);

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    const { data, error } = await query.order('issue_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Get invoice by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        payments:payments(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get invoice by number
  static async findByNumber(invoiceNumber) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Update invoice
  static async update(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .update({
        invoice_number: updateData.invoiceNumber,
        issue_date: updateData.issueDate,
        due_date: updateData.dueDate,
        subtotal: updateData.subtotal,
        tax_amount: updateData.taxAmount,
        total_amount: updateData.totalAmount,
        currency: updateData.currency,
        status: updateData.status,
        notes: updateData.notes,
        items: updateData.items,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete invoice
  static async delete(id) {
    const { error } = await supabaseAdmin.from('invoices').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // Get invoices by status
  static async findByStatus(status, adminId = null) {
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('status', status);

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get invoice statistics
  static async getStats(adminId) {
    const { data, error } = await supabase
      .from('invoices')
      .select('status, total_amount')
      .eq('admin_id', adminId);

    if (error) throw error;

    const stats = {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
      totalRevenue: 0,
    };

    data.forEach(invoice => {
      stats.total += 1;
      stats.totalRevenue += invoice.total_amount || 0;

      if (invoice.status === 'paid') stats.paid += 1;
      if (invoice.status === 'pending') stats.pending += 1;
      if (invoice.status === 'overdue') stats.overdue += 1;
    });

    return stats;
  }

  // Get overdue invoices
  static async findOverdue(adminId = null) {
    const today = new Date().toISOString().split('T')[0];
    let query = supabase
      .from('invoices')
      .select('*')
      .lt('due_date', today)
      .eq('status', 'pending');

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
