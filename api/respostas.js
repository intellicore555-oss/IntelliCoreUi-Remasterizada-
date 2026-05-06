import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await client.connect();
    const db = client.db("avaliacoes");

    await db.collection("respostas").insertOne({
      respostas: req.body,
      data: new Date()
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar" });
  }
}