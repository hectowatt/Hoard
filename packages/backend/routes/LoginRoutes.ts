import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import  jwt  from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const router = Router();
const SECRET = "my_jwt_secret_key";

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    try{
        if(username === "admin" && password === "password"){
            // トークンの作成
            const token = jwt.sign({username}, SECRET, { expiresIn: '1d' });
            res.cookie("token", token, {
                httponly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24*60*60*1000 // 1day
            });
        return res.json({success: true})
        }
        res.status(401).json({message: "Invalid credentials"});
    }catch(error){
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.userId = user.id;
        next();
    });
};


export default router;