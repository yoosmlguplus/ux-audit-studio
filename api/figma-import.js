let pendingData = null;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "POST") {
    try {
      pendingData = req.body;
      pendingData._receivedAt = Date.now();
      return res.status(200).json({ ok: true, frames: pendingData.frames?.length || 0 });
    } catch (e) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  if (req.method === "GET") {
    if (pendingData) {
      const data = pendingData;
      pendingData = null;
      return res.status(200).json(data);
    }
    return res.status(200).json(null);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
