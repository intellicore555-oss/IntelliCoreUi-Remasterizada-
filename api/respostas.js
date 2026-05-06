import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

let client = new MongoClient(uri);

export default async function handler(req, res) {

  // 🔥 CORS (ESSENCIAL)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, rota: "funcionando" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    await client.connect();
    const db = client.db("avaliacoes");

    const result = await db.collection("respostas").insertOne({
      respostas: req.body,
      data: new Date()
    });

    return res.status(200).json({ ok: true, id: result.insertedId });

  } catch (err) {
    console.error("ERRO:", err);

    return res.status(500).json({
      erro: "Falha ao salvar",
      detalhe: err.message
    });
  }
}