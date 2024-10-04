import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', verifyToken);

export default router;