import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import  jwt  from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const router = Router();
const JWT_SECRET = process.env.SECRET || 'hoard_secret';

// 認証ミドルウェア
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id;
        next();
    });
}


router.get('/', authenticateToken, (req, res) => {
    const userRepository = AppDataSource.getRepository('User');
    const users = userRepository.find();
    req.status(200).uson(users);
});


export default router;