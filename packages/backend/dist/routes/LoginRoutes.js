import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const router = Router();
const SECRET = process.env.SECRET || 'hoard_secret';
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRepository = AppDataSource.getRepository('User');
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // トークンの作成
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httponly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1day
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});
export default router;
//# sourceMappingURL=LoginRoutes.js.map