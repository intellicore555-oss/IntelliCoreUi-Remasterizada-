import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const client = await clientPromise;

    const db = client.db("meusite");
    const collection = db.collection("contador");

    let doc = await collection.findOne({ name: "visitas" });

    if (!doc) {
      doc = { name: "visitas", value: 0 };
      await collection.insertOne(doc);
    }

    doc.value++;

    await collection.updateOne(
      { name: "visitas" },
      { $set: { value: doc.value } }
    );

    res.status(200).json({ visitas: doc.value });

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}