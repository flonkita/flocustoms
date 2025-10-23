export async function post({ request }) {
  try {
    const body = await request.json();
    const webhook = process.env.INSTAGRAM_WEBHOOK_URL;

    if (webhook) {
      // Forward to configured webhook (e.g., Zapier/Make webhook or your own endpoint)
      const resp = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await resp.text();
      return new Response(JSON.stringify({ ok: true, forwarded: resp.ok, status: resp.status, responseText: text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // No webhook configured — log and return success so client receives a positive response
    console.log('Chatbot answers (no webhook configured):', body);
    return new Response(JSON.stringify({ ok: true, forwarded: false, message: 'No webhook configured. Answers logged on server.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in /api/chatbot:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
