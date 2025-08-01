import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import Password from '../entities/Password.js';
import bcrypt from "bcrypt";

const router = Router();

// 【INSERT】パスワード登録API
router.post('/', async (req, res) => {
    const { passwordString } = req.body;

    if (!passwordString) {
        return res.status(400).json({ error: "Must set password string" });
    }

    const password_hashed = await bcrypt.hash(passwordString, 10);

    try {
        const passwordRepository = AppDataSource.getRepository(Password);
        const newPassword = passwordRepository.create({
            password_hashed: password_hashed
        });
        const savedPassword = await passwordRepository.save(newPassword);

        console.log('Password inserted with ID: ', savedPassword.password_id);
        res.status(201).json({ message: "Save password success!" });
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({ error: "Failed to save password" });
    }
});

// 【SELECT】パスワードid取得API
router.get('/', async (req, res) => {
    try {
        const passwordRepository = AppDataSource.getRepository(Password);
        // passwordを取得する
        const password_hashed = await passwordRepository.find();
        if (password_hashed.length === 0) {
            return res.status(200).json({ password_id: null });
        } else {
            const id = password_hashed[0].password_id; // 最初のパスワードIDを取得
            res.status(200).json({ password_id: id });
        }
    } catch (error) {
        console.error("Error fetching password:", error);
        res.status(500).json({ error: 'Failed to fetch password' });
    }
});

// 【UPDATE】パスワード更新API
router.put('/', async (req, res) => {
    const { password_id, passwordString } = req.body;
    try {
        const passwordRepository = AppDataSource.getRepository(Password);
        const password = await passwordRepository.findOneBy({ password_id: password_id });
        if (!password) {
            return res.status(404).json({ error: "Password not found" });
        }
        password.password_hashed = await bcrypt.hash(passwordString, 10);

        await passwordRepository.save(password);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error update password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

// 【SELECT】パスワード取得API（リクエスト値とDBのハッシュ化されたパスワードが一致するかを返却）
router.post('/compare', async (req, res) => {
    try {
        const password_id = req.body.password_id;
        const passwordString = req.body.passwordString;

        console.log("サーバに届いたパスワードid:", password_id);
        console.log("サーバに届いたパスワード文字列:", passwordString);
        if (!passwordString) {
            return res.status(400).json({ error: "Must set password string" });
        }
        const passwordRepository = AppDataSource.getRepository(Password);
        // passwordを取得する
        const password = await passwordRepository.findOneBy({ password_id: password_id });
        console.log("取得したパスワード:", password);
        const isMatch = await bcrypt.compare(passwordString, password.password_hashed);
        console.log("パスワードの一致:", isMatch);
        res.status(200).json({ isMatch: isMatch });
    } catch (error) {
        console.error("Error fetching password:", error);
        res.status(500).json({ error: 'Failed to fetch password' });
    }
});

export default router;