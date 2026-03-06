import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again after 5 minutes.' }
});

router.post('/admin-login', loginLimiter, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const storedHash = process.env.ADMIN_PASSWORD_HASH;
        if (!storedHash) {
            console.error('CRITICAL: ADMIN_PASSWORD_HASH is not set in environment.');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const isValid = await bcrypt.compare(password, storedHash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid admin password' });
        }

        const jwtSecret = process.env.JWT_SECRET || 'fallback-dev-secret';

        // Sign JWT tokens for 8 hours per spec
        const token = jwt.sign(
            { role: 'admin' },
            jwtSecret,
            { expiresIn: '8h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error in admin-login:', error);
        res.status(500).json({ error: 'Failed to authenticate admin' });
    }
});

export default router;
