import { MongoClient } from "mongodb";

const uri = "SUA_URL_AQUI";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  await client.connect();

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

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json({ visitas: doc.value });
}