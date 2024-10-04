import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import authRouter from './routes/auth.routes.js';
import userProfile from './routes/user.routes.js';
import superAdmin from './routes/superAdmin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = 8000;

// Middleware.

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({origin: 'http://localhost:4200'}));
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(hpp());

// Ruta principal de la API (Auth)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userProfile);
app.use('/api/v1/super-admin', superAdmin);
app.use('/api/v1/payment', paymentRoutes);

app.get('', (req, res) => {
  res.json({ message: 'Bienvenido a la pagina oficial...'})
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});