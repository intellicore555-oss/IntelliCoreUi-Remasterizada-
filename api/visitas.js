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
  try {
    // ✅ CORS headers (sempre)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-source");

    // 🔥 responde preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const client = await clientPromise;
    const db = client.db("meusite");
    const collection = db.collection("contador");

    let doc = await collection.findOne({ name: "visitas" });

    if (!doc) {
      await collection.insertOne({ name: "visitas", value: 0 });
    }

    // 👀 GET
    if (req.method === "GET") {
      const atualizado = await collection.findOne({ name: "visitas" });
      return res.status(200).json({ visitas: atualizado.value });
    }

    // ➕ POST
    if (req.method === "POST") {
      const source = req.headers["x-source"] || "";

      if (source === "github") {
        await collection.updateOne(
          { name: "visitas" },
          { $inc: { value: 1 } }
        );
      }

      const atualizado = await collection.findOne({ name: "visitas" });

      return res.status(200).json({ visitas: atualizado.value });
    }

    return res.status(405).json({ erro: "Método não permitido" });

  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}