import { Router } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Redis } from 'ioredis';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { redis } from '../server.js';

const router = Router();
const SECRET = process.env.SECRET || 'hoard_secret';

router.post('/', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET);
            if (typeof decoded === 'object' && decoded !== null && 'jti' in decoded) {
                await redis.del(`token:${decoded.jti}`);
            }
        } catch (e) {
            console.error(e);
        }
    }
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ success: true });
});

export default router;
