export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    enabled: boolean;
}

// Mock Database with 20 items
export const products: Product[] = [
    { id: '1', name: 'High-End Laptop', description: 'Powerful dev machine', price: 1999, stock: 10, enabled: true },
    { id: '2', name: 'Wireless Mouse', description: 'Ergonomic mouse', price: 49, stock: 50, enabled: true },
    { id: '3', name: 'Mechanical Keyboard', description: 'Clicky keys', price: 129, stock: 30, enabled: true },
    { id: '4', name: '4K Monitor', description: '27-inch display', price: 399, stock: 15, enabled: true },
    { id: '5', name: 'Noise-Canceling Headphones', description: 'Immersive sound', price: 299, stock: 20, enabled: true },
    { id: '6', name: 'Webcam 4K', description: 'Crystal clear video', price: 149, stock: 25, enabled: true },
    { id: '7', name: 'Desk Chair', description: 'Lumbar support', price: 249, stock: 5, enabled: true },
    { id: '8', name: 'Standing Desk', description: 'Electric height adjust', price: 499, stock: 8, enabled: true },
    { id: '9', name: 'USB-C Dock', description: '10-in-1 hub', price: 89, stock: 40, enabled: true },
    { id: '10', name: 'External SSD 1TB', description: 'Super fast storage', price: 119, stock: 60, enabled: true },
    { id: '11', name: 'Gaming Chair', description: 'Racing style', price: 199, stock: 12, enabled: true },
    { id: '12', name: 'Smartphone Stand', description: 'Adjustable angle', price: 19, stock: 100, enabled: true },
    { id: '13', name: 'Laptop Sleeve', description: 'Protective case', price: 29, stock: 80, enabled: true },
    { id: '14', name: 'Wireless Charger', description: 'Fast charging', price: 39, stock: 45, enabled: true },
    { id: '15', name: 'Bluetooth Speaker', description: 'Portable sound', price: 59, stock: 35, enabled: true },
    { id: '16', name: 'Smart Watch', description: 'Fitness tracker', price: 199, stock: 18, enabled: true },
    { id: '17', name: 'Tablet Pro', description: 'For creatives', price: 799, stock: 7, enabled: true },
    { id: '18', name: 'Stylus Pen', description: 'Precision drawing', price: 99, stock: 22, enabled: true },
    { id: '19', name: 'Power Bank', description: '20000mAh', price: 49, stock: 55, enabled: true },
    { id: '20', name: 'Microphone Arm', description: 'Broadcast quality', price: 79, stock: 14, enabled: true },
    { id: '21', name: 'Test Product', description: 'Synced with Product Service', price: 100, stock: 100, enabled: true },
];
