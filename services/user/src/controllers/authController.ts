import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const userService = new UserService();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await userService.validatePassword(user, password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Return standard User object without sensitive data
        const { passwordHash, ...userWithoutHash } = user;

        res.json({ token, user: userWithoutHash });
    }
}
