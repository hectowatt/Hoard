import jwt from 'jsonwebtoken';
import { Redis } from 'ioredis';

const SECRET = process.env.SECRET || 'hoard_secret';
const redis = new Redis({ host: '192.168.1.103', port: 6379 });

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET);
        const status = await redis.get(`token:${decoded.jti}`);
        if (status !== 'valid') {
            return res.status(401).json({ message: 'Token invalid or expired' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
