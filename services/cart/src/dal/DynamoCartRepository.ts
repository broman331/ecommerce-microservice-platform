import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ICartRepository } from "./ICartRepository";
import { Cart } from "../models/Cart";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoCartRepository implements ICartRepository {
    private tableName = process.env.DYNAMODB_TABLE || "carts-dev";

    async findByCustomerId(customerId: string): Promise<Cart | undefined> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { customerId },
        });
        const response = await docClient.send(command);
        return response.Item as Cart | undefined;
    }

    async createOrUpdate(cart: Cart): Promise<Cart> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: cart,
        });
        await docClient.send(command);
        return cart;
    }

    async delete(customerId: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: { customerId },
        });
        await docClient.send(command);
    }
}
