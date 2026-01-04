import { ICustomerRepository, CustomerProfile } from '../dal/ICustomerRepository';

export class CustomerService {
    constructor(private repository: ICustomerRepository) { }

    async getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
        return this.repository.getProfile(userId);
    }

    // Additional business logic can go here
}
