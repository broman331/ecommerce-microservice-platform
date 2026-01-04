import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { IShippingRepository } from "./IShippingRepository";
import { ShippingAddress, Shipment } from "../models/shippingModel";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoShippingRepository implements IShippingRepository {
    private addressTable = process.env.DYNAMODB_ADDRESS_TABLE || "shipping-addresses-dev";
    private shipmentTable = process.env.DYNAMODB_SHIPMENT_TABLE || "shipments-dev";

    async getAddresses(userId: string): Promise<ShippingAddress[]> {
        const command = new ScanCommand({
            TableName: this.addressTable,
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": userId },
        });
        const response = await docClient.send(command);
        return (response.Items as ShippingAddress[]) || [];
    }

    async addAddress(address: ShippingAddress): Promise<ShippingAddress> {
        const command = new PutCommand({
            TableName: this.addressTable,
            Item: address,
        });
        await docClient.send(command);
        return address;
    }

    async createShipment(shipment: Shipment): Promise<Shipment> {
        const command = new PutCommand({
            TableName: this.shipmentTable,
            Item: shipment,
        });
        await docClient.send(command);
        return shipment;
    }

    async getShipment(id: string): Promise<Shipment | undefined> {
        const command = new GetCommand({
            TableName: this.shipmentTable,
            Key: { id },
        });
        const response = await docClient.send(command);
        return response.Item as Shipment | undefined;
    }
}
