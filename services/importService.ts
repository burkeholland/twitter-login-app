import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a CosmosClient instance using the connection string
const client = new CosmosClient(process.env.DB_CONNECTION_STRING as string);

// Define your database and container IDs
const databaseId = "linkylinkdb";
const containerId = "linkbundles";

// Function to retrieve a user's lists from Cosmos DB
async function getUserLists(userId: string): Promise<any[]> {
    const container = client.database(databaseId).container(containerId);

    const query = `SELECT * FROM c WHERE c.userId = "${userId}"`;
    const { resources } = await container.items.query(query).fetchAll();

    return resources;
}

export default { getUserLists };