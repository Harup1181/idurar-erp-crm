# IDURAR ERP CRM - Getting Started with Supabase Backend

This is a complete guide to set up and run the IDURAR ERP CRM system with the new Supabase backend.

## Project Structure

```
idurar-erp-crm/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints (Supabase-compatible)
│   │   ├── repositories/   # Data access layer for Supabase
│   │   ├── middleware/     # Auth and other middleware
│   │   └── lib/supabase.js # Supabase client configuration
│   └── package.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── modules/       # Feature modules
│   │   ├── components/    # Reusable components
│   │   ├── auth/          # Authentication services
│   │   └── style/         # CSS styles
│   └── package.json
├── scripts/               # Database migrations
│   └── 01_create_tables.sql
└── Documentation files
```

---

## Prerequisites

- **Node.js**: v20.9.0 or higher
- **npm**: v10.2.4 or higher
- **Supabase Project**: Already connected and configured
- **PostgreSQL Database**: Via Supabase

---

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Server Configuration
PORT=8888
NODE_ENV=development

# JWT Secret (for token signing)
JWT_SECRET=your_secret_key_here

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload (Optional)
UPLOAD_DIR=public/uploads
```

**To get Supabase credentials:**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy `Project URL` and `anon public key`
4. For service role key, check in the same section

### 1.3 Run Database Migrations

The Supabase schema has already been created via the SQL migration script. If you need to reset, you can run:

```sql
-- In Supabase SQL Editor, run the migration from scripts/01_create_tables.sql
```

### 1.4 Start the Backend Server
```bash
npm run dev
```

The backend will start on `http://localhost:8888`

You should see:
```
🚀 Server running on port 8888
```

---

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd frontend
npm install
```

### 2.2 Create Environment File

Create `.env.local` in the frontend directory:

```env
VITE_BACKEND_SERVER=http://localhost:8888/
VITE_FILE_BASE_URL=http://localhost:8888/public/
```

### 2.3 Start the Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## Step 3: Access the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the login page
3. **Create your first admin account** or login if you already have one

### First Time Setup

If you don't have an admin account yet:
1. Go to `http://localhost:3000/register`
2. Fill in your email, password, name
3. Click "Register"
4. You'll receive a verification email (check spam folder)
5. Verify your email
6. Login with your credentials

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Clients
- `GET /api/clients` - Get all clients (paginated)
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices (paginated)
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Payments
- `GET /api/payments` - Get all payments (paginated)
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

---

## Project Features

### Core Functionality
- ✅ User Authentication (Sign up, login, password reset)
- ✅ Client Management (Create, read, update, delete)
- ✅ Invoice Management (Create, issue, track payments)
- ✅ Payment Tracking (Record payments, generate reports)
- ✅ Dashboard (Overview of business metrics)
- ✅ Settings (Company info, invoice customization)

### Database Architecture
- **Admins**: User accounts with authentication
- **Clients**: Customer information and contact details
- **Invoices**: Invoice records with line items and totals
- **Payments**: Payment records linked to invoices

---

## Development Workflow

### Making Changes to the Backend
1. Edit files in `backend/src/`
2. Server automatically restarts on changes (with nodemon)
3. Test your API endpoints
4. Changes to routes are immediately available

### Making Changes to the Frontend
1. Edit files in `frontend/src/`
2. Browser automatically reloads on changes (Vite HMR)
3. Test your UI changes
4. Changes appear instantly in browser

---

## Troubleshooting

### Frontend Shows Blank Screen
**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab to see if API calls are failing
4. Verify backend is running on `http://localhost:8888`
5. Hard refresh: `Ctrl+Shift+R`

### Cannot Connect to Backend
**Solution:**
1. Check if backend is running: `npm run dev` in backend folder
2. Verify port 8888 is not in use
3. Check firewall settings
4. Verify `.env` variables in frontend are correct

### Database Connection Error
**Solution:**
1. Check your Supabase credentials in `.env`
2. Verify Supabase project is active
3. Check database migrations were applied
4. Verify network connectivity to Supabase

### CORS Errors
**Solution:**
1. Backend already has CORS configured
2. Ensure backend is running
3. Check browser console for specific error
4. Verify API URL in frontend matches backend URL

### Cannot Login
**Solution:**
1. Verify email and password are correct
2. Check if you've registered first
3. Check backend logs for error messages
4. Verify database tables exist (run migrations)

---

## Deployment

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel
```

### Deploy to Your Server (Backend)
```bash
cd backend
npm run build  # if needed
NODE_ENV=production npm start
```

Update frontend `.env.production.local`:
```env
VITE_BACKEND_SERVER=https://your-backend-domain.com/
VITE_FILE_BASE_URL=https://your-backend-domain.com/public/
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Check backend logs for errors
3. Check browser console (F12) for frontend errors
4. Review the API documentation in this file

---

## Next Steps

1. ✅ Backend setup complete
2. ✅ Database schema created
3. ✅ Frontend ready to run
4. 📝 Create your first admin account
5. 📝 Start using the system

Happy invoicing! 📊

