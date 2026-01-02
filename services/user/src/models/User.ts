export interface User {
    id: string;
    email: string;
    passwordHash: string; // Simplification for mock
    name: string;
    createdAt: string;
}

// Helper to simulate hash (bcrypt would be async/complex for simple mock file)
// We'll use the check in UserService to validate 'password123' against these.
const MOCK_HASH = '$2a$10$abcdefg...'; // Dummy hash

export const users: User[] = [
    { id: '1', email: 'test@example.com', name: 'Test User', passwordHash: MOCK_HASH, createdAt: '2023-01-01T10:00:00Z' },
    { id: '2', email: 'alice@example.com', name: 'Alice Smith', passwordHash: MOCK_HASH, createdAt: '2023-02-15T14:30:00Z' },
    { id: '3', email: 'bob@example.com', name: 'Bob Johnson', passwordHash: MOCK_HASH, createdAt: '2023-03-10T09:15:00Z' },
    { id: '4', email: 'carol@example.com', name: 'Carol White', passwordHash: MOCK_HASH, createdAt: '2023-04-05T16:45:00Z' },
    { id: '5', email: 'dave@example.com', name: 'Dave Brown', passwordHash: MOCK_HASH, createdAt: '2023-05-20T11:20:00Z' },
    { id: '6', email: 'eve@example.com', name: 'Eve Davis', passwordHash: MOCK_HASH, createdAt: '2023-06-25T13:50:00Z' },
    { id: '7', email: 'frank@example.com', name: 'Frank Miller', passwordHash: MOCK_HASH, createdAt: '2023-07-30T10:10:00Z' },
    { id: '8', email: 'grace@example.com', name: 'Grace Wilson', passwordHash: MOCK_HASH, createdAt: '2023-08-12T15:40:00Z' },
    { id: '9', email: 'henry@example.com', name: 'Henry Taylor', passwordHash: MOCK_HASH, createdAt: '2023-09-18T09:30:00Z' },
    { id: '10', email: 'isabel@example.com', name: 'Isabel Anderson', passwordHash: MOCK_HASH, createdAt: '2023-10-22T14:55:00Z' },
];
