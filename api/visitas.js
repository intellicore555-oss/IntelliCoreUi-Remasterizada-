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
      doc = { name: "visitas", value: 0 };
      await collection.insertOne(doc);
    }

    // 👀 GET → só mostra
    if (req.method === "GET") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({ visitas: doc.value });
    }

    // ➕ POST → incrementa (e pode proteger)
    if (req.method === "POST") {
      const origin = req.headers.origin || "";
      const referer = req.headers.referer || "";

      const permitido =
        origin.includes("seuusuario.github.io") ||
        referer.includes("seuusuario.github.io");

      if (!permitido) {
        return res.status(403).json({ erro: "Acesso negado" });
      }

      res.setHeader("Access-Control-Allow-Origin", "https://seuusuario.github.io");

      const novoValor = doc.value + 1;

      await collection.updateOne(
        { name: "visitas" },
        { $set: { value: novoValor } }
      );

      return res.status(200).json({ visitas: novoValor });
    }

    return res.status(405).json({ erro: "Método não permitido" });

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}