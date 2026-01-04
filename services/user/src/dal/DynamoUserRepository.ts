import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { IUserRepository } from "./IUserRepository";
import { User } from "../models/User";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoUserRepository implements IUserRepository {
    private tableName = process.env.DYNAMODB_TABLE || "users-dev";

    async findAll(): Promise<User[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
        });
        const response = await docClient.send(command);
        return (response.Items as User[]) || [];
    }

    async findByEmail(email: string): Promise<User | undefined> {
        // Scan for email since it's not the primary key (assuming 'id' is PK).
        // In prod, this should use a GSI (Global Secondary Index).
        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: { ":email": email },
        });
        const response = await docClient.send(command);
        return response.Items && response.Items.length > 0 ? (response.Items[0] as User) : undefined;
    }

    async findById(id: string): Promise<User | undefined> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id },
        });
        const response = await docClient.send(command);
        return response.Item as User | undefined;
    }

    async create(user: User): Promise<User> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: user,
        });
        await docClient.send(command);
        return user;
    }
}
