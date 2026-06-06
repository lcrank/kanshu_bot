require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_REFERER || "https://github.com/lara-sk-bot",
    "X-Title": process.env.OPENROUTER_TITLE || "Lara SK Reels Bot",
  },
});

const SYSTEM_PROMPT = `You are a world-class Instagram Reels scriptwriter for a tech company founder in India.
You specialise in creating 60-second reel scripts for Instagram that drive engagement, saves, and followers.

CREATOR PROFILE:
- Platform: Instagram Reels
- Audience: Tech-curious Indians & global tech audience — developers, AI enthusiasts, productivity seekers
- Tone: Confident, conversational, slightly punchy — not academic, not bro-ish
- Language: Indian English (natural, not forced desi slang)
- Niche: AI Tools + Productivity (core), Gadgets, Programming, Tech News

60-SECOND MINI-DOC STRUCTURE:
0–4s   → Big hook: tease the ending or make a bold claim
4–15s  → Context: why this story/topic matters RIGHT NOW
15–35s → Core content: 3 beats with pattern interrupts every 7s
35–50s → Twist or payoff: the thing they stayed for
50–58s → Takeaway: one actionable insight
58–60s → CTA: strong ask (comment / save this)

RETENTION RULES:
- Open loop in first 3 seconds — deliver payoff at second 50+
- Re-hook at 15s: "But here's where it gets wild…" or "Wait — there's a catch."
- Pattern interrupt every 7–10s (cut instruction, B-roll note, text overlay change)
- PAS structure: Problem → Agitate → Solve
- Rule of 3: exactly 3 tips/beats — not 5, not 7
- Use specific numbers: "47% faster" beats "much faster"

HOOK FORMULAS — always write 3 options:
1. Curiosity Gap: "Most people don't know [X] exists"
2. Bold Claim: "[Thing everyone believes] is completely wrong"
3. Relatable Pain: "If you've ever struggled with [X]..."

CTA BANK (use ONE per reel):
- "Save this — you'll want it later" (best for saves)
- "Comment which tool you use — I read every reply" (algo boost)
- "Follow so you don't miss the next one"
- "Send this to one dev friend right now"

EIES SCORING (score every concept):
- Emotion: Does it make someone feel something? (0–3)
- Information: Does it teach something genuinely useful? (0–3)
- Entertainment: Is it fun/satisfying to watch? (0–3)
- Shareability: Would someone tag a friend? (0–3)
Score 9+ = high-potential. Below 7 = rethink angle.

OUTPUT FORMAT — always respond in this exact structure:

📌 TOPIC: [topic name]
🎯 NICHE: [niche angle]
📊 EIES SCORE: E_/3  I_/3  E_/3  S_/3  Total: _/12

━━━ 🎣 HOOK OPTIONS (pick one) ━━━
A [Curiosity Gap]: [hook text]
B [Bold Claim]: [hook text]
C [Relatable Pain]: [hook text]

━━━ 🎬 60-SECOND SCRIPT ━━━
[0–4s] HOOK: [exact words to say]
[4–15s] CONTEXT: [exact words to say]
[15–22s] BEAT 1: [exact words to say]
[22–29s] BEAT 2: [exact words to say]
[29–35s] BEAT 3: [exact words to say]
[35–50s] PAYOFF/TWIST: [exact words to say]
[50–58s] TAKEAWAY: [exact words to say]
[58–60s] CTA: [exact words to say]

━━━ 📝 CAPTION ━━━
[Caption text — punchy opener, 2–3 lines, CTA, hashtags]

━━━ #️⃣ HASHTAGS ━━━
[5 hashtags: 1 large 1M+, 2 medium 100k–1M, 2 small <100k]

━━━ 🎥 B-ROLL NOTES ━━━
[What to show on screen at each beat — specific, actionable]`;

const userSessions = {};

async function generateScript(userMessage, chatId) {
  const history = userSessions[chatId] || [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  const response = await openrouter.chat.completions.create({
    model,
    max_tokens: 2000,
    messages,
  });

  const assistantText = response.choices[0].message.content;

  userSessions[chatId] = [
    ...history,
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantText },
  ].slice(-8);

  return assistantText;
}

function getTodayString() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function createBot(token, options = {}) {
  const bot = new TelegramBot(token, options);

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || "Creator";

    bot.sendMessage(
      chatId,
      `🎬 *Hey ${firstName}! Welcome to your Reels Script Bot.*\n\n` +
        `I generate perfect 60-second Instagram Reel scripts for your tech brand — tailored, structured, and ready to film.\n\n` +
        `*Here's what I can do:*\n` +
        `📅 /today — Generate today's reel script (AI picks the best trending topic)\n` +
        `🎯 /topic [idea] — Script for a specific topic you have in mind\n` +
        `💡 /ideas — Get 5 hot reel ideas for this week\n` +
        `🔄 /regenerate — Regenerate the last script with a fresh angle\n` +
        `❓ /help — Show all commands\n\n` +
        `_Start with_ /today _to get your first script!_`,
      { parse_mode: "Markdown" }
    );
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      `📖 *Commands*\n\n` +
        `/today — Today's reel script (topic auto-selected)\n` +
        `/topic [your idea] — Script for a custom topic\n` +
        `   _e.g. /topic ChatGPT vs Gemini_\n` +
        `/ideas — 5 reel ideas for this week\n` +
        `/regenerate — Fresh version of last script\n` +
        `/niche [category] — Focus on a niche\n` +
        `   _e.g. /niche AI tools_ or _/niche productivity_\n\n` +
        `💬 Or just *type any topic freely* and I'll script it!\n\n` +
        `_Every script includes: Hook options, timestamped script, caption, hashtags & B-roll notes._`,
      { parse_mode: "Markdown" }
    );
  });

  bot.onText(/\/today/, async (msg) => {
    const chatId = msg.chat.id;
    const today = getTodayString();

    const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);
    bot.sendChatAction(chatId, "typing");

    try {
      const prompt = `Today is ${today}. I need a 60-second Instagram Reel script for my tech company's Instagram page. 
      Pick the MOST relevant, trending, or timely tech topic for today — something that would perform well right now on Instagram for an Indian tech audience. 
      Choose from: AI tools, productivity hacks, programming tips, gadget news, startup stories, or tech news.
      Make it feel fresh and relevant to what's happening in tech RIGHT NOW.`;

      const script = await generateScript(prompt, chatId);
      clearInterval(typing);

      await bot.sendMessage(chatId, `📅 *Today's Reel Script — ${today}*\n\n${script}`, {
        parse_mode: "Markdown",
      });

      await bot.sendMessage(
        chatId,
        `✅ Script ready! Use /regenerate for a fresh angle, or /topic [idea] for a custom topic.`,
        { parse_mode: "Markdown" }
      );
    } catch (err) {
      clearInterval(typing);
      console.error(err);
      bot.sendMessage(chatId, `❌ Something went wrong. Please try again in a moment.`);
    }
  });

  bot.onText(/\/topic (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const topic = match[1].trim();

    bot.sendChatAction(chatId, "typing");
    const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);

    try {
      const prompt = `Create a 60-second Instagram Reel script for my tech company about: "${topic}". 
      Make it engaging, informative, and optimised for Instagram's Indian tech audience.`;

      const script = await generateScript(prompt, chatId);
      clearInterval(typing);

      await bot.sendMessage(chatId, `🎯 *Script: ${topic}*\n\n${script}`, {
        parse_mode: "Markdown",
      });
    } catch (err) {
      clearInterval(typing);
      console.error(err);
      bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
    }
  });

  bot.onText(/\/ideas/, async (msg) => {
    const chatId = msg.chat.id;
    const today = getTodayString();

    bot.sendChatAction(chatId, "typing");
    const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);

    try {
      const prompt = `Today is ${today}. Give me 5 high-potential Instagram Reel ideas for a tech company targeting Indian tech audience this week. 
      For each idea, give:
      - 🎬 Title/Topic
      - 🎣 Best hook (one line)
      - 📊 EIES Score
      - ⏱️ Best format (15s/30s/60s)
      - 🔥 Why it will perform well right now
      
      Format them clearly with emojis. Make them diverse across niches.`;

      const ideas = await generateScript(prompt, chatId);
      clearInterval(typing);

      await bot.sendMessage(chatId, `💡 *5 Reel Ideas for This Week*\n\n${ideas}`, {
        parse_mode: "Markdown",
      });

      await bot.sendMessage(
        chatId,
        `👆 Pick one and use: /topic [your chosen topic] to get the full script!`,
        { parse_mode: "Markdown" }
      );
    } catch (err) {
      clearInterval(typing);
      console.error(err);
      bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
    }
  });

  bot.onText(/\/regenerate/, async (msg) => {
    const chatId = msg.chat.id;

    if (!userSessions[chatId] || userSessions[chatId].length === 0) {
      return bot.sendMessage(chatId, `⚠️ No previous script found. Use /today or /topic first!`);
    }

    bot.sendChatAction(chatId, "typing");
    const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);

    try {
      const prompt = `Regenerate a completely different version of the last script. Use a different hook style, different angle, different structure beat order. Make it feel fresh — different energy, different CTA.`;

      const script = await generateScript(prompt, chatId);
      clearInterval(typing);

      await bot.sendMessage(chatId, `🔄 *Regenerated Script*\n\n${script}`, {
        parse_mode: "Markdown",
      });
    } catch (err) {
      clearInterval(typing);
      console.error(err);
      bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
    }
  });

  bot.onText(/\/niche (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const niche = match[1].trim();

    bot.sendChatAction(chatId, "typing");
    const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);

    try {
      const today = getTodayString();
      const prompt = `Today is ${today}. Create a 60-second Instagram Reel script specifically in the "${niche}" niche for my tech company. 
      Pick the most relevant, trending angle within this niche right now. Make it perfect for Indian tech audience.`;

      const script = await generateScript(prompt, chatId);
      clearInterval(typing);

      await bot.sendMessage(chatId, `📂 *Script — ${niche} Niche*\n\n${script}`, {
        parse_mode: "Markdown",
      });
    } catch (err) {
      clearInterval(typing);
      console.error(err);
      bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
    }
  });

  bot.on("message", async (msg) => {
    if (msg.text && !msg.text.startsWith("/")) {
      const chatId = msg.chat.id;

      bot.sendChatAction(chatId, "typing");
      const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);

      try {
        const prompt = `Create a 60-second Instagram Reel script for my tech company about: "${msg.text}". 
        Treat this as a topic request. Make it engaging and optimised for Instagram.`;

        const script = await generateScript(prompt, chatId);
        clearInterval(typing);

        await bot.sendMessage(chatId, script, { parse_mode: "Markdown" });
      } catch (err) {
        clearInterval(typing);
        console.error(err);
        bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
      }
    }
  });

  return bot;
}

if (require.main === module) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const bot = createBot(token, { polling: true });
  console.log("🤖 Reels Bot is running...");
}

module.exports = { createBot, userSessions, generateScript, getTodayString };
