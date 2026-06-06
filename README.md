# 🎬 Tech Reels Telegram Bot

A Telegram bot that generates **perfect 60-second Instagram Reel scripts** for your tech company — powered by Claude AI, built around the Tech Reels Creator framework.

---

## ✨ Features

| Command | What it does |
|---|---|
| `/today` | Auto-generates today's reel script with the best trending tech topic |
| `/topic [idea]` | Script for any custom topic (e.g. `/topic ChatGPT vs Gemini`) |
| `/ideas` | 5 high-potential reel ideas for this week with EIES scores |
| `/regenerate` | Fresh version of the last script with a different angle |
| `/niche [category]` | Script focused on a specific niche (e.g. `/niche AI tools`) |
| Free text | Just type any topic and get a script instantly |

Every script includes:
- ✅ 3 hook options
- ✅ Timestamped 60-second script
- ✅ Caption ready to copy-paste
- ✅ 5 hashtags (large + medium + small)
- ✅ B-roll notes for filming

---

## 🚀 Local Setup (5 minutes)

### 1. Clone or download this folder

```bash
cd reels-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API keys

Copy the example env file:

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Getting your Telegram Bot Token:**
1. Open Telegram → search `@BotFather`
2. Send `/newbot`
3. Follow the steps, copy the token it gives you

**Getting your Anthropic API Key:**
1. Go to https://console.anthropic.com
2. API Keys → Create Key
3. Copy and paste it

### 4. Run the bot

```bash
npm start
```

You should see: `🤖 Reels Bot is running...`

Open your Telegram bot and send `/start` — it's live!

---

## ☁️ Deploy for Free (Always-On)

> ⚠️ **Why not Vercel/Netlify?**  
> Telegram bots use **long polling** — they need a persistent server that stays running. Vercel and Netlify are serverless (functions that sleep). Use **Railway** or **Render** instead — both are free.

---

### Option A: Railway (Recommended — easiest)

1. Go to https://railway.app and sign up with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Push this folder to a GitHub repo first:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/reels-bot.git
   git push -u origin main
   ```
4. In Railway → select your repo → it auto-detects Node.js
5. Go to **Variables** tab → add:
   - `TELEGRAM_BOT_TOKEN` = your token
   - `ANTHROPIC_API_KEY` = your key
6. Click **Deploy** — done! Free tier gives you $5/month credit (enough for this bot)

---

### Option B: Render (Also free)

1. Go to https://render.com → sign up with GitHub
2. New → **Web Service** → connect your GitHub repo
3. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node bot.js`
   - **Plan**: Free
4. Add Environment Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `ANTHROPIC_API_KEY`
5. Click **Create Web Service**

> ⚠️ Free Render instances sleep after 15 mins of inactivity. Use Railway for always-on.

---

### Option C: Run locally forever (no deployment needed)

If you just want it running on your laptop/server:

```bash
npm install -g pm2
pm2 start bot.js --name reels-bot
pm2 save
pm2 startup
```

PM2 keeps it running in the background and restarts on crashes.

---

## 💡 Usage Tips

- Use `/today` every morning to get fresh content ideas
- Use `/ideas` on Monday to plan the whole week
- After getting a script, `/regenerate` if you want a different energy/angle
- Just type freely: `"I want a reel about India's startup ecosystem"` works too

---

## 🧠 How It Works

The bot uses Claude Sonnet (Anthropic) with a detailed system prompt built around the **Tech Reels Creator framework**:
- 60-second Mini-Doc structure with exact timestamps
- Hook formulas (Curiosity Gap, Bold Claim, Relatable Pain)
- EIES viral scoring (Emotion + Information + Entertainment + Shareability)
- Indian English tone for Indian tech audience
- Caption + hashtag strategy built in

---

## 📁 File Structure

```
reels-bot/
├── bot.js          ← Main bot logic
├── package.json    ← Dependencies
├── .env.example    ← Environment template
├── .env            ← Your secrets (never commit this)
├── .gitignore      ← Ignores node_modules and .env
├── Procfile        ← For Railway/Render deployment
└── README.md       ← This file
```

---

## 🔒 Security Notes

- Never commit `.env` to GitHub (it's in `.gitignore`)
- Add env variables directly in Railway/Render dashboard
- Your API keys are only stored in your environment — never in code

---

Built with ❤️ for tech content creators in India.
