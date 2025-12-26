import jwt from 'jsonwebtoken';
import { Redis } from 'ioredis';
import { redis } from '../server.js';

const SECRET = process.env.SECRET || 'hoard_secret';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET);
        if (typeof decoded !== 'string' && 'jti' in decoded) {
            const status = await redis.get(`token:${decoded.jti}`);
            if (status !== 'valid') {
                return res.status(401).json({ message: 'Token invalid or expired' });
            }
            req.user = decoded;
            return next();
        } else {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
