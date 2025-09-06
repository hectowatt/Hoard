import { authMiddleware } from '../../middleware/AuthMiddleware.js';
import jwt from 'jsonwebtoken';
import { Redis } from 'ioredis';

jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        get: jest.fn((key) => key === 'token:valid-jti' ? 'valid' : null),
    }));
});

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn((token, secret) => {
        if (token === 'valid-token') {
            return { jti: 'valid-jti', id: 'test-user-id' };
        }
        throw new Error('Invalid token');
    }),
}));

describe('AuthMiddleware', () => {
    it('should call next() for a valid token', async () => {
        const req = { cookies: { token: 'valid-token' , user: {jti: 'valid-jti', id: 'test-user-id'}} } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ jti: 'valid-jti', id: 'test-user-id' });
    });

    it('should return 401 for an invalid token', async () => {
        const req = { cookies: { token: 'invalid-token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', async () => {
        const req = { cookies: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });
});