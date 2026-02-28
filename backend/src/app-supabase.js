import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// Supabase routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import clientRoutes from './routes/client.js';
import invoiceRoutes from './routes/invoice.js';
import paymentRoutes from './routes/payment.js';

// Legacy routes (optional)
// import coreAuthRouter from './routes/coreRoutes/coreAuth.js';
// import coreApiRouter from './routes/coreRoutes/coreApi.js';
// import coreDownloadRouter from './routes/coreRoutes/coreDownloadRouter.js';
// import corePublicRouter from './routes/coreRoutes/corePublicRouter.js';
// import adminAuth from './controllers/coreControllers/adminAuth.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Supabase API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);

// Legacy routes (uncomment to enable)
// app.use('/api', coreAuthRouter);
// app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
// app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
// app.use('/download', coreDownloadRouter);
// app.use('/public', corePublicRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
