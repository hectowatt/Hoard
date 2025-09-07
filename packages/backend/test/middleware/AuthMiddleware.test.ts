import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from "express";


// Redisのgetメソッドのモック関数
const mockRedisGet = jest.fn<() => Promise<string | null>>();

const mockJwtVerify = jest.fn((token, secret) => {
    if (token === 'valid-token') {
        return { jti: 'valid-jti', id: 'test-user-id', username: 'testuser' };
    }
    throw new Error('Invalid token');
});

// jwt.signのモック関数
const mockJwtSign = jest.fn(() => 'valid-token');

jest.unstable_mockModule("ioredis", () => ({
    Redis: jest.fn().mockImplementation(() => ({
        set: jest.fn<(...args: any[]) => Promise<string>>().mockResolvedValue("OK"),
        get: mockRedisGet,
    })),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    __esModule: true,
    default: {
        verify: mockJwtVerify,
        sign: mockJwtSign,
    },
    verify: mockJwtVerify,
    sign: mockJwtSign,
}));


const { authMiddleware } = await import('../../dist/middleware/AuthMiddleware.js');
const { app, hoardserver } = await import("../../dist/server.js");

const jwt = (await import('jsonwebtoken')).default;

const SECRET = 'hoard_secret';


describe('AuthMiddleware', () => {

    beforeEach(() => {
        mockJwtVerify.mockClear();
        mockJwtSign.mockClear();
        mockRedisGet.mockClear();
    });

    it('should call next() for a valid token that exists in Redis', async () => {
        const payload = { jti: 'valid-jti', id: 'test-user-id', username: 'testuser' };
        
        const token = jwt.sign(payload, SECRET);

        mockRedisGet.mockResolvedValueOnce('valid');

        const req = { cookies: { token }, user: undefined } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(mockJwtVerify).toHaveBeenCalledWith('valid-token', SECRET);

        expect(mockRedisGet).toHaveBeenCalledWith('token:valid-jti');

        expect(next).toHaveBeenCalled();

        expect(req.user).toMatchObject(payload);
    });

    it('should return 401 for a token that is not valid in Redis', async () => {
        const token = jwt.sign({ jti: 'expired-jti' }, SECRET);

        mockRedisGet.mockResolvedValueOnce(null);

        const req = { cookies: { token } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token invalid or expired' });
        expect(next).not.toHaveBeenCalled();
    });


    it('should return 401 for an invalid token signature', async () => {
        const req = { cookies: { token: 'invalid-signature-token' } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', async () => {
        const req = { cookies: {} } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    afterAll(async () => {
        if (hoardserver) {
            await new Promise<void>((resolve, reject) => {
                hoardserver.close((err) => (err ? reject(err) : resolve()));
            });
        };

        jest.clearAllTimers();
    });
});
