export interface CustomerProfile {
    // User props (based on User Service User model)
    id: string;
    email: string;
    role: string;
    name?: string;

    // Aggregated data
    orders: any[];
    wishlist: any[];
}

export interface ICustomerRepository {
    getProfile(userId: string): Promise<CustomerProfile | null>;
    // Note: create/update might be limited on Aggregator, but we add them for CRUD compliance
    saveProfile(profile: CustomerProfile): Promise<CustomerProfile>;
}
