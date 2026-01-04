import { Request, Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export class UserController {
    async getProfile(req: AuthRequest, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.sendStatus(401);
        }

        const user = await userService.findById(userId);
        if (!user) {
            return res.sendStatus(404);
        }

        const { passwordHash, ...userWithoutHash } = user;
        res.json(userWithoutHash);
    }
    getAllUsers: RequestHandler = async (req, res) => {
        // In real app, check for ADMIN role.
        const users = await userService.findAll();
        const safeUsers = users.map(({ passwordHash, ...u }) => u);
        res.json(safeUsers);
    }

    getUserById: RequestHandler = async (req, res) => {
        const { id } = req.params;
        const user = await userService.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { passwordHash, ...userWithoutHash } = user;
        res.json(userWithoutHash);
    }
}
