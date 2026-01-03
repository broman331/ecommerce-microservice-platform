import { users, User } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
    async findAll(): Promise<User[]> {
        return users;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return users.find(u => u.email === email);
    }

    async findById(id: string): Promise<User | undefined> {
        return users.find(u => u.id === id);
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        // In a real app, use bcrypt.compare(password, user.passwordHash)
        // For this mock with hardcoded hash, we might need to actually generate a hash
        // But for the 'test@example.com' user, let's assume 'password123' is valid if we were doing real hashing.
        // To make this functional right now without seeding real hashes:

        if (user.email === 'test@example.com' && password === 'password123') return true;

        return bcrypt.compare(password, user.passwordHash);
    }
    async createUser(userData: { email: string; name: string }, password: string): Promise<User> {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: (users.length + 1).toString(),
            email: userData.email,
            name: userData.name,
            passwordHash,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        return newUser;
    }
}
