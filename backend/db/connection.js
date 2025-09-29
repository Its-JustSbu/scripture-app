import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

config();

const { ATLAS_URI } = process.env;
const client = new MongoClient(ATLAS_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

try {
    await client.connect();
    await client.db("admin").command({ ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (e) {
    console.error(e);
}

let db = client.db("scripturesDB")
export default db;