import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import HoardUser from '../entities/HoardUser.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = Router();
const SECRET = process.env.SECRET || 'hoard_secret';
// 【SELECT】User存在確認API
router.get('/isexist', async (req, res) => {
    const userRepository = AppDataSource.getRepository('HoardUser');
    const users = await userRepository.find();
    if (users && users.length > 0) {
        return res.status(200).json({ exists: true });
    }
    else {
        return res.status(200).json({ exists: false });
    }
});
// 【SELECT】User取得API
router.get('/', authMiddleware, async (req, res) => {
    const userRepository = AppDataSource.getRepository('HoardUser');
    const users = await userRepository.find();
    res.status(200).json(users);
});
// 【INSERT】User登録API
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("パラメータ：", username, password);
        const userRepository = AppDataSource.getRepository(HoardUser);
        const password_hashed = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            username: username,
            password: password_hashed,
            createdate: new Date(),
            updatedate: new Date()
        });
        const savedUser = await userRepository.save(newUser);
        const token = jwt.sign({ id: savedUser.id, username: savedUser.username }, SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            domain: "localhost",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? 'true' : 'false',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 1day
        });
        res.status(201).json({ message: "regist user success!" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=HoardUserRoutes.js.map