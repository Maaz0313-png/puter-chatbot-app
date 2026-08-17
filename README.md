# Multiplex — Multi-Model AI Chat

Static, no-backend chatbot built on [Puter.js](https://docs.puter.com). No API keys, no server — Puter's User-Pays model handles AI costs via the visitor's free Puter account (a one-time sign-in popup appears on first message).

## Models included (all chat models from each provider's Puter.js tutorial, excluding OpenAI and any provider whose tutorial says a new API key now starts at zero — that excluded xAI/Grok)

161 models total across 10 providers, grouped in the select box:

| Provider | Count | Tutorial |
|---|---|---|
| Anthropic (Claude) | 15 | [Free, Unlimited Claude API](https://developer.puter.com/tutorials/free-unlimited-claude-35-sonnet-api/) |
| Google (Gemini) | 16 | [Free, Unlimited Gemini API](https://developer.puter.com/tutorials/free-gemini-api/) |
| Google (Gemma) | 7 | [Free, Unlimited Gemma API](https://developer.puter.com/tutorials/free-unlimited-gemma-api/) |
| Z.AI (GLM) | 17 | [Free, Unlimited Z.AI GLM API](https://developer.puter.com/tutorials/free-unlimited-zai-glm-api/) |
| DeepSeek | 11 | [Free, Unlimited DeepSeek API](https://developer.puter.com/tutorials/free-unlimited-deepseek-api/) |
| Qwen | 55 | [Free, Unlimited Qwen API](https://developer.puter.com/tutorials/free-unlimited-qwen-api/) |
| Mistral | 26 | [Free, Unlimited Mistral API](https://developer.puter.com/tutorials/free-unlimited-mistral-api/) |
| Moonshot AI (Kimi) | 7 | [Free, Unlimited Kimi API](https://developer.puter.com/tutorials/free-unlimited-kimi-k2-api/) |
| Meta (Llama) | 5 | [Free, Unlimited Llama API](https://developer.puter.com/tutorials/free-unlimited-llama-api/) |
| Microsoft | 2 | [Free, Unlimited Microsoft Phi API](https://developer.puter.com/tutorials/free-unlimited-microsoft-phi-api/) |

Excluded: OpenAI/Codex models entirely (per your request), plus xAI's Grok — its tutorial is the only one among these providers whose "Free API Key" section says a new API key now starts at zero. Pure image-generation models (e.g. Qwen Image, Nano Banana) are left out since this is a `puter.ai.chat()`-only interface.


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
