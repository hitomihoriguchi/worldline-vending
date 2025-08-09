export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    hasKey: !!process.env.OPENAI_API_KEY,
    keyLen: (process.env.OPENAI_API_KEY || '').length,
    env: process.env.VERCEL_ENV || 'unknown'
  });
}
