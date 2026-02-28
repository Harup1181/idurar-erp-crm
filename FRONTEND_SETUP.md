# Frontend Setup Guide

## Quick Start

### Prerequisites
- Node.js 20.9.0 or higher
- npm 10.2.4 or higher

### Installation Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env.local file** (in the frontend directory)
```env
VITE_BACKEND_SERVER=http://localhost:8888/
VITE_FILE_BASE_URL=http://localhost:8888/public/
```

4. **Start the development server**
```bash
npm run dev
```

The app will run on `http://localhost:3000`

---

## Configuration for Different Environments

### Development (Local Backend)
```env
# .env.local
VITE_BACKEND_SERVER=http://localhost:8888/
VITE_FILE_BASE_URL=http://localhost:8888/public/
```

### Production
```env
# .env.production.local
VITE_BACKEND_SERVER=https://your-backend-domain.com/
VITE_FILE_BASE_URL=https://your-backend-domain.com/public/
```

---

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint validation
- `npm run dev:remote` - Run with remote backend

---

## Backend Requirements

The frontend expects the backend API to be running with the following endpoints:

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/verify/:userId/:emailToken` - Email verification
- `POST /api/resetpassword` - Reset password

### Clients
- `GET /api/client` - Get all clients
- `GET /api/client/:id` - Get client by ID
- `POST /api/client` - Create client
- `PUT /api/client/:id` - Update client
- `DELETE /api/client/:id` - Delete client

### Invoices
- `GET /api/invoice` - Get all invoices
- `GET /api/invoice/:id` - Get invoice by ID
- `POST /api/invoice` - Create invoice
- `PUT /api/invoice/:id` - Update invoice
- `DELETE /api/invoice/:id` - Delete invoice

### Payments
- `GET /api/payment` - Get all payments
- `GET /api/payment/:id` - Get payment by ID
- `POST /api/payment` - Create payment
- `PUT /api/payment/:id` - Update payment
- `DELETE /api/payment/:id` - Delete payment

---

## Troubleshooting

### Blank White Screen
1. Check browser console for errors (F12 → Console)
2. Verify backend server is running on `http://localhost:8888`
3. Check that all environment variables are set correctly
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### API Connection Errors
1. Ensure backend is running
2. Check CORS settings in backend configuration
3. Verify the API URL in `.env.local` matches your backend URL
4. Check browser console for CORS or network errors

### Missing Styles
1. Make sure all CSS files in `/src/style/partials/` are imported
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Restart the development server

---

## Technology Stack

- **React 18.3.1** - UI framework
- **Redux + Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Ant Design 5.14.1** - UI component library
- **Vite 5.4.8** - Build tool
- **Axios** - HTTP client

