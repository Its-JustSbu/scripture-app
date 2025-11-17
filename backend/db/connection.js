import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

config();

const { ATLAS_URI } = process.env;
const client = new MongoClient(ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 150,
  timeoutMS: 30000,
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (e) {
    console.error(e);
  }
}

run().catch(console.dir);

let db = client.db("scripturesDB");
export default db;