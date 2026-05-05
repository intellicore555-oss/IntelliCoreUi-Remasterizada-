catch (error) {
  res.status(500).json({ erro: error.message });
}