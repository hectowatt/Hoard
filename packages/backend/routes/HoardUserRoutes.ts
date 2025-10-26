import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import HoardUser from '../entities/HoardUser.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redis } from '../server.js';
import { nanoid } from 'nanoid';

const router = Router();
const SECRET = process.env.SECRET || 'hoard_secret';

// 【SELECT】User存在確認API
router.get('/isexist', async (req, res) => {
    const userRepository = AppDataSource.getRepository('HoardUser');
    const users = await userRepository.find();
    if (users && users.length > 0) {
        return res.status(200).json({ exists: true });
    } else {
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
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
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
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : "localhost", // 本番はenvファイルの設定を使用,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 1day
        });
        res.status(201).json({ message: "regist user success!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// 【UPDATE】User更新API
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        // cookie から JWT を取得
        const prevToken = req.cookies.token;
        if (!prevToken) {
            return res.status(401).json({ error: "No token provided" });
        }

        // JWT を検証・デコード
        const decoded = jwt.verify(prevToken, SECRET);
        const user_id = decoded.id;
        const oldJti = decoded.jti;

        // user_id でユーザーを検索
        const userRepository = AppDataSource.getRepository(HoardUser);
        const user = await userRepository.findOneBy({ id: user_id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const password_hashed = await bcrypt.hash(password, 10);


        if (!username) {
            if (!password) {
                // usernameとpasswordの両方が空の場合はエラー
                return res.status(400).json({ error: "Must set password or username" });
            } else {
                // passwordのみ入力されている場合
                user.password = password_hashed;
            }
        } else {
            if (!password) {
                // usernameのみ入力されている場合
                user.username = username;
            } else {
                // usernameとpasswordの両方が入力されている場合
                user.username = username;
                user.password = password_hashed;
            }
        }

        user.updatedate = new Date();
        const savedUser = await userRepository.save(user);

        const newJti = nanoid();
        const newToken = jwt.sign({ id: savedUser.id, username: savedUser.username, jti: newJti }, SECRET, { expiresIn: '1d' });

        if (oldJti) {
            console.log("old jti is deleted.")
            await redis.del(`token:${oldJti}`); // 古いトークンを無効化
        }

        await redis.set(`token:${newJti}`, 'valid', 'EX', 24 * 60 * 60); // 新しいトークンを登録
        console.log("new jti is set.")

        res.cookie("token", newToken, {
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : "localhost", // 本番はenvファイルの設定を使用,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 1day
        });
        res.status(201).json({ message: "update user success!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// 【SELECT】パスワード比較API（リクエスト値とDBのハッシュ化されたパスワードが一致するかを返却）
router.post('/compare', authMiddleware, async (req, res) => {
    try {
        // cookie から JWT を取得
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // JWT を検証・デコード
        const decoded = jwt.verify(token, SECRET);
        const user_id = decoded.id;

        const passwordString = req.body.passwordString;
        if (!passwordString) {
            return res.status(400).json({ error: "Must set password string" });
        }

        // user_id でユーザーを検索
        const userRepository = AppDataSource.getRepository(HoardUser);
        const user = await userRepository.findOneBy({ id: user_id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // パスワード比較
        const isMatch = await bcrypt.compare(passwordString, user.password);
        console.log("パスワードの一致:", isMatch);

        res.status(200).json({ isMatch });
    } catch (error) {
        console.error("Error comparing password:", error);
        res.status(500).json({ error: 'Failed to compare password' });
    }
});

export default router;