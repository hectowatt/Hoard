import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import jwt from 'jsonwebtoken';
const router = Router();
const JWT_SECRET = process.env.SECRET || 'hoard_secret';
// 認証ミドルウェア
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        req.userId = decoded.id;
        next();
    });
}
router.get('/', (req, res) => {
    const userRepository = AppDataSource.getRepository('HoardUser');
    const users = userRepository.find();
    res.status(200).json(users);
});
export default router;
//# sourceMappingURL=HoardUserRoutes.js.map