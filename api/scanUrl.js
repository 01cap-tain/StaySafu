module.exports = async function handler(req, res) {
  const { url } = req.body;
  try {
    const response = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: {
        "x-apikey": process.env.apiKey,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ url }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
