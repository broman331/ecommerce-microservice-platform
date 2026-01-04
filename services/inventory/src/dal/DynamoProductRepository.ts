import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { IProductRepository } from "./IProductRepository";
import { Product } from "../models/Product";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoProductRepository implements IProductRepository {
    private tableName = process.env.DYNAMODB_TABLE || "inventory-dev";

    async findAll(): Promise<Product[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
        });
        const response = await docClient.send(command);
        return (response.Items as Product[]) || [];
    }

    async findById(id: string): Promise<Product | undefined> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id },
        });
        const response = await docClient.send(command);
        return response.Item as Product | undefined;
    }

    async create(product: Product): Promise<Product> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: product,
        });
        await docClient.send(command);
        return product;
    }

    async update(id: string, product: Partial<Product>): Promise<Product | undefined> {
        // Construct UpdateExpression dynamically
        const updateKeys = Object.keys(product).filter(k => k !== 'id');
        if (updateKeys.length === 0) return this.findById(id);

        const updateExpression = "set " + updateKeys.map((key) => `#${key} = :${key}`).join(", ");
        const expressionAttributeNames = updateKeys.reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
        const expressionAttributeValues = updateKeys.reduce((acc, key) => ({ ...acc, [`:${key}`]: (product as any)[key] }), {});

        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        });

        try {
            const response = await docClient.send(command);
            return response.Attributes as Product;
        } catch (error) {
            console.error("DynamoDB Update Error", error);
            return undefined;
        }
    }
}
