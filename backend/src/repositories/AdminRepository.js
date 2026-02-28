import { supabaseAdmin, supabase } from '../lib/supabase.js';

export class AdminRepository {
  // Create new admin
  static async create(adminData) {
    const { email, password, firstName, lastName, phone, address, ...rest } = adminData;

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    // Create admin profile
    const { data, error } = await supabaseAdmin
      .from('admins')
      .insert({
        user_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        ...rest,
      })
      .select()
      .single();

    if (error) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    return data;
  }

  // Get all admins
  static async findAll() {
    const { data, error } = await supabase.from('admins').select('*');
    if (error) throw error;
    return data;
  }

  // Get admin by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Get admin by user_id
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  }

  // Get admin by email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  }

  // Update admin
  static async update(id, updateData) {
    const { password, ...rest } = updateData;

    // Update password if provided
    if (password) {
      const admin = await this.findById(id);
      await supabaseAdmin.auth.admin.updateUserById(admin.user_id, { password });
    }

    // Update admin profile
    const { data, error } = await supabaseAdmin
      .from('admins')
      .update({
        ...rest,
        first_name: rest.firstName,
        last_name: rest.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete admin
  static async delete(id) {
    const admin = await this.findById(id);
    
    // Delete auth user
    await supabaseAdmin.auth.admin.deleteUser(admin.user_id);

    // Delete admin record
    const { error } = await supabaseAdmin.from('admins').delete().eq('id', id);
    if (error) throw error;

    return { success: true };
  }

  // Check if email exists
  static async emailExists(email) {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single();
    
    return !error && data;
  }
}
