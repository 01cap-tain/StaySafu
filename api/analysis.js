module.exports = async function handler(req, res) {
  const { id } = req.query;
  try {
    const reportRes = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${id}`,
      {
        headers: {
          "x-apikey": process.env.apiKey,
        },
      },
    );
    const reportData = await reportRes.json();
    res.json(reportData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
