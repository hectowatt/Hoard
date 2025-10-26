import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from "bcrypt";
import { nanoid } from 'nanoid';
import { redis } from '../server.js';
const router = Router();
const SECRET = process.env.SECRET || 'hoard_secret';
// 【SELECT】ログイン認証API
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRepository = AppDataSource.getRepository('HoardUser');
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (await bcrypt.compare(password, user.password)) {
            const jti = nanoid();
            // トークンの作成
            const token = jwt.sign({ id: user.id, username: user.username, jti: jti }, SECRET, { expiresIn: '1d' });
            await redis.set(`token:${jti}`, 'valid', 'EX', 60 * 60 * 24);
            res.cookie("token", token, {
                domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : "localhost", // 本番はenvファイルの設定を使用,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false, // 本番のみ secure
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ローカルは lax
                path: "/", // 明示的にルートに適用
                maxAge: 24 * 60 * 60 * 1000 // 1day
            });
            return res.status(200).json({ success: true });
        }
        else {
            return res.status(401).json({ success: false });
        }
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});
export default router;
//# sourceMappingURL=LoginRoutes.js.map