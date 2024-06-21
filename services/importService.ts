import { CosmosClient } from "@azure/cosmos";
import Hasher from "../utils/hasher";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a CosmosClient instance using the connection string
const client = new CosmosClient(process.env.DB_CONNECTION_STRING as string);

// Define your database and container IDs
const databaseId = "the-urlist";
const containerId = "linkbundles";

// Function to retrieve a user's lists from Cosmos DB
async function getUserListsCount(userId: string): Promise<number> {
    const container = client.database(databaseId).container(containerId);

    const querySpec = {
        query: "SELECT VALUE COUNT(1) FROM c WHERE c.userId = @userId",
        parameters: [
            {
                name: "@userId",
                value: userId
            }
        ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    const count = resources[0]; // This will be the count of items

    return count;
}

// Function to update a user's lists in Cosmos DB
async function importLists(userId: string, newUserid: string, newIdentityProvider: string) {
    const container = client.database(databaseId).container(containerId);

    const hashedUsername = Hasher.hashString(newUserid);

    const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
            {
                name: "@userId",
                value: userId
            }
        ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    // create a new item for each existing item
    for (const item of resources) {
        const newItem = {
            userId: hashedUsername,
            vanityUrl: item.vanityUrl,
            description: item.description,
            links: item.links,
            identityProvider: newIdentityProvider
        }

        await container.items.create(newItem);
    };
}

export default { getUserListsCount, importLists };