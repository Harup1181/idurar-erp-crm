import { supabaseAdmin, supabase } from '../lib/supabase.js';

export class ClientRepository {
  // Create new client
  static async create(clientData) {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert({
        company_name: clientData.companyName,
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        postal_code: clientData.postalCode,
        country: clientData.country,
        tax_number: clientData.taxNumber,
        notes: clientData.notes,
        admin_id: clientData.adminId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all clients
  static async findAll(adminId = null) {
    let query = supabase.from('clients').select('*');
    if (adminId) {
      query = query.eq('admin_id', adminId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get client by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Get client by email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  }

  // Update client
  static async update(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({
        company_name: updateData.companyName,
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.city,
        state: updateData.state,
        postal_code: updateData.postalCode,
        country: updateData.country,
        tax_number: updateData.taxNumber,
        notes: updateData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete client
  static async delete(id) {
    const { error } = await supabaseAdmin.from('clients').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // Search clients
  static async search(query, adminId = null) {
    let dbQuery = supabase
      .from('clients')
      .select('*')
      .or(`company_name.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
    
    if (adminId) {
      dbQuery = dbQuery.eq('admin_id', adminId);
    }

    const { data, error } = await dbQuery;
    if (error) throw error;
    return data;
  }

  // Get clients with invoice count
  static async findAllWithStats(adminId = null) {
    let query = supabase
      .from('clients')
      .select(`
        *,
        invoices:invoices(count)
      `);
    
    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
