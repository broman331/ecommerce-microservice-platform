export interface ShippingAddress {
    id: string;
    userId: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Shipment {
    id: string;
    orderId: string;
    userId: string;
    distributorId: string;
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
    trackingNumber: string;
    shippedAt: string;
    items: any[];
}

// In-memory storage
export const addresses: ShippingAddress[] = [];
export const shipments: Shipment[] = [];

// Populate Mock Data
const generateMockData = () => {
    const streets = ['Main St', 'Broadway', 'Wall St', 'Fifth Ave', 'Park Ave'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];

    for (let i = 1; i <= 10; i++) {
        const userId = i.toString();
        // Add 1-2 addresses per user
        const numAddresses = Math.floor(Math.random() * 2) + 1;

        for (let j = 0; j < numAddresses; j++) {
            addresses.push({
                id: `addr-${addresses.length + 1}`,
                userId,
                fullName: `User ${userId}`,
                streetAddress: `${Math.floor(Math.random() * 999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
                city: cities[Math.floor(Math.random() * cities.length)],
                state: states[Math.floor(Math.random() * states.length)],
                zipCode: (10000 + Math.floor(Math.random() * 90000)).toString(),
                country: 'USA'
            });
        }
    }
};

generateMockData();
