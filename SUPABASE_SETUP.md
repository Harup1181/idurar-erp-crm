# Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for your ERP/CRM application.

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Node.js 16+ installed
- Environment variables configured

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Organization: Select or create one
   - Project name: Your ERP/CRM project name
   - Database password: Create a strong password
   - Region: Select closest to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://[PROJECT_ID].supabase.co`
   - **Anon Key**: (Restricted key, safe for frontend)
   - **Service Role Key**: (Admin key, keep secret!)

## Step 3: Configure Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Step 4: Run Database Migrations

The database schema has been automatically created by executing the SQL migration file. The following tables are now available:

- **admins**: Admin user profiles
- **clients**: Customer information
- **invoices**: Invoice records
- **payments**: Payment records
- **invoice_items**: Line items for invoices

## Step 5: Set Up Authentication

### Enable Email Authentication in Supabase:

1. Go to **Authentication** → **Providers**
2. Enable "Email" provider
3. Go to **Auth** → **Email Templates**
4. Customize email templates if needed (optional)

### CORS Configuration:

1. Go to **Settings** → **API**
2. Add your frontend URL to **CORS_ALLOWED_ORIGINS**:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```

## Step 6: Set Up Row Level Security (RLS)

RLS ensures users can only access their own data. Enable RLS on all tables:

1. Go to **Authentication** → **Policies**
2. Create policies for each table to ensure:
   - Users can read their own records
   - Users can create records associated with their ID
   - Users can only update/delete their own records

Example policy for `clients` table:
```sql
-- Users can view their own clients
CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (admin_id = auth.uid());

-- Users can create clients
CREATE POLICY "Users can create clients"
ON clients FOR INSERT
WITH CHECK (admin_id = auth.uid());

-- Users can update their own clients
CREATE POLICY "Users can update their own clients"
ON clients FOR UPDATE
USING (admin_id = auth.uid());

-- Users can delete their own clients
CREATE POLICY "Users can delete their own clients"
ON clients FOR DELETE
USING (admin_id = auth.uid());
```

## Step 7: Install Dependencies

```bash
cd backend
npm install @supabase/supabase-js
```

## Step 8: Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user
- `POST /api/auth/reset-password` - Reset password

### Admins
- `GET /api/admins` - Get all admins (admin only)
- `GET /api/admins/me` - Get current admin
- `GET /api/admins/:id` - Get admin by ID
- `POST /api/admins` - Create new admin
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/stats` - Get clients with stats
- `GET /api/clients/search/:query` - Search clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/stats` - Get invoice statistics
- `GET /api/invoices/overdue` - Get overdue invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/stats` - Get payment statistics
- `GET /api/payments/date-range` - Get payments by date range
- `GET /api/payments/invoice/:invoiceId` - Get invoice payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## Testing the API

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

## Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env` file exists in the project root
- Verify all three environment variables are correctly set

### "User does not have access"
- Enable RLS policies (see Step 6)
- Check that the JWT token is valid
- Ensure the user is authenticated before making requests

### "Database error"
- Check that the database migrations have been executed
- Verify Supabase project status is "Active"

## Next Steps

1. Set up the frontend with Supabase Auth
2. Configure additional authentication methods (Google, GitHub, etc.)
3. Set up email templates for password resets
4. Implement backups and monitoring
5. Set up staging and production environments

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Authentication Concepts](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
