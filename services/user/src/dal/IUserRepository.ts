import { User } from '../models/User';

export interface IUserRepository {
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    create(user: User): Promise<User>;
}
