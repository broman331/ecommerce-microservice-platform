import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { IOrderRepository } from "./IOrderRepository";
import { Order } from "../models/Order";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoOrderRepository implements IOrderRepository {
    private tableName = process.env.DYNAMODB_TABLE || "orders-dev";

    async findByUserId(userId: string): Promise<Order[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": userId },
        });
        const response = await docClient.send(command);
        return (response.Items as Order[]) || [];
    }

    async findById(id: string): Promise<Order | undefined> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id },
        });
        const response = await docClient.send(command);
        return response.Item as Order | undefined;
    }

    async create(order: Order): Promise<Order> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: order,
        });
        await docClient.send(command);
        return order;
    }

    async update(id: string, order: Partial<Order>): Promise<Order | undefined> {
        const updateKeys = Object.keys(order).filter(k => k !== 'id');
        if (updateKeys.length === 0) return this.findById(id);

        const updateExpression = "set " + updateKeys.map((key) => `#${key} = :${key}`).join(", ");
        const expressionAttributeNames = updateKeys.reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
        const expressionAttributeValues = updateKeys.reduce((acc, key) => ({ ...acc, [`:${key}`]: (order as any)[key] }), {});

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
            return response.Attributes as Order;
        } catch {
            return undefined;
        }
    }

    async search(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]> {
        // Scanning with filters (Inefficient for prod, but OK for MVP)
        let filterExpression = [];
        let expressionAttributeValues: any = {};

        if (filters.userId) {
            filterExpression.push("userId = :userId");
            expressionAttributeValues[":userId"] = filters.userId;
        }
        if (filters.startDate) {
            filterExpression.push("createdAt >= :startDate");
            expressionAttributeValues[":startDate"] = filters.startDate;
        }
        if (filters.endDate) {
            filterExpression.push("createdAt <= :endDate");
            expressionAttributeValues[":endDate"] = filters.endDate;
        }

        if (filterExpression.length === 0) return this.scanAll();

        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: filterExpression.join(" AND "),
            ExpressionAttributeValues: expressionAttributeValues,
        });

        const response = await docClient.send(command);
        return (response.Items as Order[]) || [];
    }

    private async scanAll(): Promise<Order[]> {
        const command = new ScanCommand({ TableName: this.tableName });
        const response = await docClient.send(command);
        return (response.Items as Order[]) || [];
    }
}
