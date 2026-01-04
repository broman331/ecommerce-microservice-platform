import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

import { MemoryUserRepository } from '../dal/MemoryUserRepository';
import { DynamoUserRepository } from '../dal/DynamoUserRepository';
import { FirestoreUserRepository } from '../dal/FirestoreUserRepository';
import { IUserRepository } from '../dal/IUserRepository';

let userRepository: IUserRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        userRepository = new DynamoUserRepository();
        break;
    case 'firestore':
        userRepository = new FirestoreUserRepository();
        break;
    default:
        userRepository = new MemoryUserRepository();
}

const userService = new UserService(userRepository);
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

    async register(req: Request, res: Response) {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password and name are required' });
        }

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await userService.createUser({ email, name }, password);
        const { passwordHash, ...userWithoutHash } = newUser;

        res.status(201).json({ user: userWithoutHash });
    }
}
