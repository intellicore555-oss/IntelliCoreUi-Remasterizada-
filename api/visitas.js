let visitas = 0;

export default function handler(req, res) {
  // 🔥 libera acesso externo
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  visitas++;

  res.status(200).json({ visitas });
}