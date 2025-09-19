module.exports = async function handler(req, res) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) throw new Error('Missing N8N_WEBHOOK_URL env variable');

    // Parse request body (if needed)
    const body = req.body || {};

    const upstreamResp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const upstreamText = await upstreamResp.text();

    if (!upstreamResp.ok) {
      console.error('Upstream webhook error:', upstreamResp.status, upstreamText);
      return res.status(500).json({ error: `Webhook error ${upstreamResp.status}: ${upstreamText}` });
    }

    // Return the webhook result directly
    res.status(200).send(upstreamText);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
