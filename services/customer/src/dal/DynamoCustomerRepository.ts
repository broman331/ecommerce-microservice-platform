import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ICustomerRepository, CustomerProfile } from "./ICustomerRepository";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoCustomerRepository implements ICustomerRepository {
    private tableName = process.env.DYNAMODB_TABLE || "customers-profile-dev";

    async getProfile(userId: string): Promise<CustomerProfile | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id: userId },
        });
        const response = await docClient.send(command);
        return response.Item as CustomerProfile | null;
    }

    async saveProfile(profile: CustomerProfile): Promise<CustomerProfile> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: profile,
        });
        await docClient.send(command);
        return profile;
    }
}
