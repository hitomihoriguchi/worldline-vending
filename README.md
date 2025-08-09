// /api/generate-story.js  (通信エラー対策版)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    // 受信ボディを安全にパース（文字列/空/ストリーム全部ケア）
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
    if (!body || (typeof body === 'object' && !Object.keys(body).length)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') } catch { body = {} }
    }
    const { answers = [], total = 20 } = body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers 配列が必要です' });
    }

    const normalized = answers.map((a,i)=>`${i+1}) ${String(a||'').slice(0,300)}`);
    const prompt =
`あなたはプロの小説家です。以下の回答（合計 ${total} 問）をすべて自然に物語へ溶かし込み、
日本語で一人称・現在形・透明感のある短編（約900〜1200字）を出力してください。
列挙は避け、身体感覚・音・光を織り交ぜ、最後に一行アファメーションと次の一手(3ステップ)を添えてください。

回答:
${normalized.join('\n')}

出力フォーマット:
— 奇跡が起きた未来の一日 —
<本文>

■ 一行アファメーション
■ 次の一手（3ステップ）`;

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '日本語で、小説的かつ過度な比喩に依らず、感覚情報を大切に表現してください。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 1200
      })
    });

    const data = await r.json().catch(()=> ({}));
    if (!r.ok) return res.status(500).json({ error: data?.error || data || 'openai_error' });

    const story = data?.choices?.[0]?.message?.content?.trim?.() || '';
    return res.status(200).json({ story });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
