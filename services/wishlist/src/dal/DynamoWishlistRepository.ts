import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { IWishlistRepository } from "./IWishlistRepository";
import { Wishlist } from "../models/Wishlist";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoWishlistRepository implements IWishlistRepository {
    private tableName = process.env.DYNAMODB_TABLE || "wishlists-dev";

    async findByCustomerId(customerId: string): Promise<Wishlist | undefined> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { customerId },
        });
        const response = await docClient.send(command);
        return response.Item as Wishlist | undefined;
    }

    async save(wishlist: Wishlist): Promise<Wishlist> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: wishlist,
        });
        await docClient.send(command);
        return wishlist;
    }
}
