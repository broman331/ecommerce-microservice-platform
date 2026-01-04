import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { IPromotionRepository } from "./IPromotionRepository";
import { Promotion } from "../models/promotion";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoPromotionRepository implements IPromotionRepository {
    private tableName = process.env.DYNAMODB_TABLE || "promotions-dev";

    async findAll(): Promise<Promotion[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
        });
        const response = await docClient.send(command);
        return (response.Items as Promotion[]) || [];
    }

    async findByCode(code: string): Promise<Promotion | undefined> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { code },
        });
        const response = await docClient.send(command);
        return response.Item as Promotion | undefined;
    }

    async save(promotion: Promotion): Promise<Promotion> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: promotion,
        });
        await docClient.send(command);
        return promotion;
    }
}
