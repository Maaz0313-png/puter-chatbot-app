# Multiplex — Multi-Model AI Chat

Static, no-backend chatbot built on [Puter.js](https://docs.puter.com). No API keys, no server — Puter's User-Pays model handles AI costs via the visitor's free Puter account (a one-time sign-in popup appears on first message).

## Models included (from Puter.js tutorials, excluding OpenAI and any provider whose tutorial says a new API key now starts at zero — this excluded xAI/Grok)

| Provider | Model | ID |
|---|---|---|
| Anthropic | Claude Opus 5 | `anthropic/claude-opus-5` |
| Google | Gemini 3.6 Flash | `google/gemini-3.6-flash` |
| Z.AI | GLM 5.2 | `z-ai/glm-5.2` |
| DeepSeek | DeepSeek V4 Pro | `deepseek/deepseek-v4-pro` |
| Qwen | Qwen 3.7 Max | `qwen/qwen3.7-max` |
| Mistral | Mistral Small 4 | `mistralai/mistral-small-2603` |
| Moonshot AI | Kimi K2.6 | `moonshotai/kimi-k2.6` |
| Google | Gemma 4 31B | `google/gemma-4-31b-it` |
| Meta | Llama 4 Maverick | `meta-llama/llama-4-maverick` |
| Microsoft | Phi-4 | `microsoft/phi-4` |

Responses stream in and render as Markdown (headings, code blocks, lists, tables, links) via `marked.js`, sanitized with `DOMPurify`.

## Run locally

No build step needed — it's plain HTML/CSS/JS.

```bash
npx serve .
# or just open index.html in a browser
```

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm i -g vercel
cd multiplex
vercel        # preview deploy
vercel --prod # production deploy
```

**Option B — Git + Dashboard**
1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Other** (static site). No build command, no output directory override needed — Vercel serves `index.html` as-is.
4. Deploy.

## Files
- `index.html` — page structure + model `<select>`
- `style.css` — dark theme UI
- `script.js` — chat logic, streaming, Markdown rendering
- `vercel.json` — clean URLs config
