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
    const client = await clientPromise;

    const db = client.db("meusite");
    const collection = db.collection("contador");

    let doc = await collection.findOne({ name: "visitas" });

    if (!doc) {
      await collection.insertOne({ name: "visitas", value: 0 });
    }

    // 👀 GET → mostrar visitas
    if (req.method === "GET") {
      const atualizado = await collection.findOne({ name: "visitas" });

      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({ visitas: atualizado.value });
    }

    // ➕ POST → incrementar visitas
    if (req.method === "POST") {
      // 🔓 liberar geral (depois você pode restringir)
      res.setHeader("Access-Control-Allow-Origin", "*");

      // 🔥 incremento correto (evita erro de contagem)
      await collection.updateOne(
        { name: "visitas" },
        { $inc: { value: 1 } }
      );

      const atualizado = await collection.findOne({ name: "visitas" });

      return res.status(200).json({ visitas: atualizado.value });
    }

    return res.status(405).json({ erro: "Método não permitido" });

  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}