import { MongoClient } from "mongodb";

const uri = "mongodb+srv://intellicore555_db_user:299792458anjinho%40@cluster0.gnh9bcl.mongodb.net/meusite?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

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

  res.status(200).json({ visitas: doc.value });
}