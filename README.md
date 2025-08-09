# 世界線自販機™ — 奇跡の未来日記（AI小説生成）
このフォルダをGitHubにアップし、VercelでImportすると動きます。

## 手順
1. GitHubで新規リポジトリを作成 → この3ファイルをアップ
   - /index.html
   - /api/generate-story.js
   - /README.md

2. Vercelで Import Project → 環境変数を設定
   - KEY: OPENAI_API_KEY / VALUE: あなたのOpenAIキー

3. Deploy → 20問に答えて「AIで小説生成（β）」で実行

## 注意
- APIキーは必ず Vercel の環境変数に。フロントには埋め込まないこと。
- コストを抑える場合は model を 'gpt-4o-mini' のまま、品質重視は 'gpt-4.1' に変更可。
