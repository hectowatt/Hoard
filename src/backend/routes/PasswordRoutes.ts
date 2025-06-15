import { Router } from 'express';
import { AppDataSource } from '../data-source.js';
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

        console.log('Label inserted with ID: ', savedPassword.password_id);
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
        const id = password_hashed[0].password_id; // 最初のパスワードIDを取得
        res.status(200).json(id);
    } catch (error) {
        console.error("Error fetching password:", error);
        res.status(500).json({ error: 'Failed to fetch password' });
    }
});

// 【UPDATE】パスワード更新API
router.update('/:id', async (req, res) => {
    const { id, passwordString } = req.params;
    try {
        const passwordRepository = AppDataSource.getRepository(Password);
        const password = await passwordRepository.findOneBy({ password_id: id });
        if (!password) {
            return res.status(404).json({ error: "Password not found" });
        }
        password.password_hashed = await bcrypt.hash(passwordString, 10);

        await passwordRepository.remove(password);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error update password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

// 【SELECT】パスワード取得API（リクエスト値とDBのハッシュ化されたパスワードが一致するかを返却）
router.get('/compare', async (req, res) => {
    try {
        const passwordRepository = AppDataSource.getRepository(Password);
        // passwordを取得する
        const password_hashed = await passwordRepository.find();
        const isMatch = await bcrypt.compare(req.body.passwordString, password_hashed);
        res.status(200).json(isMatch);
    } catch (error) {
        console.error("Error fetching password:", error);
        res.status(500).json({ error: 'Failed to fetch password' });
    }
});

export default router;