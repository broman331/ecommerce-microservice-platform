import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { IProductRepository } from "./IProductRepository";
import { EnrichedProduct } from "../services/aggregatorService";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoProductRepository implements IProductRepository {
    private tableName = process.env.DYNAMODB_TABLE || "products-enriched-dev";

    async getAll(): Promise<EnrichedProduct[]> {
        const command = new ScanCommand({ TableName: this.tableName });
        const response = await docClient.send(command);
        return (response.Items as EnrichedProduct[]) || [];
    }

    async getById(id: string): Promise<EnrichedProduct | null> {
        const command = new GetCommand({ TableName: this.tableName, Key: { id } });
        const response = await docClient.send(command);
        return response.Item as EnrichedProduct || null;
    }

    async create(data: any): Promise<EnrichedProduct> {
        const product: EnrichedProduct = {
            id: randomUUID(),
            ...data,
            totalOrders: 0,
            lastOrderedAt: null
        };
        const command = new PutCommand({ TableName: this.tableName, Item: product });
        await docClient.send(command);
        return product;
    }

    async update(id: string, data: any): Promise<EnrichedProduct> {
        // Simplified update for demo
        const product = await this.getById(id);
        if (!product) throw new Error("Product not found");

        const updated = { ...product, ...data };
        const command = new PutCommand({ TableName: this.tableName, Item: updated });
        await docClient.send(command);
        return updated;
    }
}
