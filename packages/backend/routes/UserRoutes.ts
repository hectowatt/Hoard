import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import { jwt } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const router = Router();
const mockUser = {"id": 1, "username": "admin"};

router.get('/', (req, res) => {
    if (req.userId === mockUser.id) {
        return res.json(mockUser);
    }
    res.status(404).json({ message: "User not found" });
});


export default router;