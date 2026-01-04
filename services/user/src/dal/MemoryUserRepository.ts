import { IUserRepository } from './IUserRepository';
import { User, users as initialUsers } from '../models/User';

export class MemoryUserRepository implements IUserRepository {
    private users: User[] = [...initialUsers];

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(u => u.email === email);
    }

    async findById(id: string): Promise<User | undefined> {
        return this.users.find(u => u.id === id);
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }
}
