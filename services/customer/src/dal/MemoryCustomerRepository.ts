import { ICustomerRepository, CustomerProfile } from './ICustomerRepository';

export class MemoryCustomerRepository implements ICustomerRepository {
    private profiles: Map<string, CustomerProfile> = new Map();

    async getProfile(userId: string): Promise<CustomerProfile | null> {
        return this.profiles.get(userId) || null;
    }

    async saveProfile(profile: CustomerProfile): Promise<CustomerProfile> {
        this.profiles.set(profile.id, profile);
        return profile;
    }
}
