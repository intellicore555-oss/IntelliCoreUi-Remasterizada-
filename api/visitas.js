let visitas = 0;

export default function handler(req, res) {
  visitas++;
  res.status(200).json({ visitas });
}
