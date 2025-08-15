import { Router } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Redis } from 'ioredis';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = Router();
const SECRET = process.env.SECRET || 'hoard_secret';
const redis = new Redis({host: '192.168.1.103', port: 6379});

router.post('/',authMiddleware, async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET);
            await redis.del(`token:${decoded.jti}`);
        } catch (e) {
            console.error(e);
        }
    }
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ success: true });
});

export default router;
