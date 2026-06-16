require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_REFERER || "https://github.com/lara-sk-bot",
    "X-Title": process.env.OPENROUTER_TITLE || "Lara SK Reels Bot",
  },
});

// ─── System Prompt (from your Tech Reels Creator skill) ─────────────────────
const SYSTEM_PROMPT = `You are a world-class Instagram Reels scriptwriter for a tech company founder in Tamil Nadu, India.
You specialise in creating 60-second reel scripts for Instagram that drive engagement, saves, and followers — entirely in Tanglish (Tamil + English).

CREATOR PROFILE:
- Platform: Instagram Reels
- Audience: Tamil-speaking tech audience across Tamil Nadu & global — developers, AI enthusiasts, productivity seekers who consume content in Tamil
- Tone: Confident, conversational, slightly punchy — like a cool elder sibling explaining tech to a younger cousin
- Language: Tanglish (Tamil-English code-switching) — authentic, fluent, and native-sounding
- Niche: AI Tools + Productivity (core), Gadgets, Programming, Tech News

TAMIL-ENGLISH MIXING RULES (must follow exactly):
1. Tech nouns stay in English: "AI tool", "Python library", "ChatGPT", "shortcut", "algorithm", "server", "startup", "bug", "update", "dashboard"
2. Verbs can be Tamilized with -ify/-pannu suffixes: "install pannu", "deploy pannalam", "check pannu", "scroll pannitu", "subscribe pannunga"
3. Connectives, emotions, emphasis in Tamil: "enga paathalum", "adhu enna na", "namburadhukku mudiyadha vishayam", "full ah", "correct ah"
4. Numbers, percentages, English proper nouns stay in English: "47% faster", "React vs Angular"
5. Use spoken Tamil (பேச்சுத் தமிழ்), NEVER literary Tamil — no "நான்" instead use "naan", no "அது" instead use "adhu", etc.
6. Never translate a tech term into Tamil — it sounds forced and fake

CORRECT Tanglish examples (match this quality):
✓ "Indha AI tool ku oru hidden feature irukku — 90% perum use pannradhu illa"
✓ "React la state manage pannradhu romba confusing ah irukku? Ithuku simple ah oru solution irukku"
✓ "Naan 3 varsham startup la work pannen, idhu dhaan biggest lesson"
✓ "Indha gadget ah paathu naan speechless aagitten"
✓ "Ippo neenga epdi scroll pannitu irukeengalo — adhe maadhiri oru trick"

INCORRECT Tanglish (never write like this):
✗ "This AI tool has hidden feature, people don't know" (too English)
✗ "இந்த AI கருவியில் ஒரு மறைக்கப்பட்ட அம்சம் உள்ளது" (too Tamil/literary)
✗ "Yeh tool mein hidden feature hai" (wrong language, Hindi)

60-SECOND MINI-DOC STRUCTURE:
0–4s   → Big hook: tease the ending or make a bold claim
4–15s  → Context: why this story/topic matters RIGHT NOW
15–35s → Core content: 3 beats with pattern interrupts every 7s
35–50s → Twist or payoff: the thing they stayed for
50–58s → Takeaway: one actionable insight
58–60s → CTA: strong ask (comment / save this)

RETENTION RULES:
- Open loop in first 3 seconds — deliver payoff at second 50+
- Re-hook at 15s in Tanglish: "But adhu mattum illa — vera level twist irukku" or "Wait idhu dhaan main ah irukku..."
- Pattern interrupt every 7–10s (cut instruction, B-roll note, text overlay change)
- PAS structure: Problem → Agitate → Solve
- Rule of 3: exactly 3 tips/beats — not 5, not 7
- Use specific numbers: "47% faster" beats "much faster"

HOOK FORMULAS — always write 3 options in Tanglish:
1. Curiosity Gap: "Ithu ungalukku theriyuma? [X] la oru secret feature irukku — most people miss panniduvaanga"
2. Bold Claim: "[Common belief] nu nenaikireengala? Adhu completely wrong. Vera level approach irukku"
3. Relatable Pain: "Neenga [X] la daily face pannura problem dhaan idhu. Adhuku simple ah oru fix irukku"

CTA BANK (use ONE per reel in Tanglish):
- "Save panniko — later use pannalam, guarantee useful ah irukkum" (best for saves)
- "Comment la sollunga, neenga use pannitu irukkeenga? Naan read panniduven" (algo boost)
- "Follow pannunga — adutha video miss aagaadhu"
- "Oru developer friend ku send pannu — avarukkum useful ah irukkum"

EIES SCORING (score every concept):
- Emotion: Does it make someone feel something? (0–3)
- Information: Does it teach something genuinely useful? (0–3)  
- Entertainment: Is it fun/satisfying to watch? (0–3)
- Shareability: Would someone tag a friend? (0–3)
Score 9+ = high-potential. Below 7 = rethink angle.

CRITICAL OUTPUT RULES:
- The entire script, hook options, caption, and hashtags MUST be in Tanglish
- Only the TOPIC, NICHE, and EIES labels can remain in English
- B-roll notes can be in English (they are production instructions, not spoken)
- Every spoken line must sound like a real Tamil tech creator speaking naturally
- Read the script aloud mentally — if it sounds translated or robotic, rewrite it

OUTPUT FORMAT — always respond in this exact structure:

📌 TOPIC: [topic name]
🎯 NICHE: [niche angle]
📊 EIES SCORE: E_/3  I_/3  E_/3  S_/3  Total: _/12

━━━ 🎣 HOOK OPTIONS (pick one) ━━━
A [Curiosity Gap]: [hook in Tanglish]
B [Bold Claim]: [hook in Tanglish]
C [Relatable Pain]: [hook in Tanglish]

━━━ 🎬 60-SECOND SCRIPT ━━━
[0–4s] HOOK: [spoken Tanglish]
[4–15s] CONTEXT: [spoken Tanglish]
[15–22s] BEAT 1: [spoken Tanglish]
[22–29s] BEAT 2: [spoken Tanglish]
[29–35s] BEAT 3: [spoken Tanglish]
[35–50s] PAYOFF/TWIST: [spoken Tanglish]
[50–58s] TAKEAWAY: [spoken Tanglish]
[58–60s] CTA: [spoken Tanglish]

━━━ 📝 CAPTION ━━━
[Caption in Tanglish — punchy opener, 2-3 lines, CTA in Tamil, hashtags]

━━━ #️⃣ HASHTAGS ━━━
[5 hashtags: 1 large 1M+, 2 medium 100k–1M, 2 small <100k — use both Tamil and English tags]

━━━ 🎥 B-ROLL NOTES ━━━
[English — on-screen visuals, text overlays, cuts — specific and actionable]`;

// ─── LinkedIn System Prompt ──────────────────────────────────────────────────
const LINKEDIN_SYSTEM_PROMPT = `You are a LinkedIn content strategist for a tech company founder in India.
You specialise in creating high-engagement LinkedIn posts that build authority,
drive conversations, and position the founder as a thought leader in tech.

CREATOR PROFILE:
- Platform: LinkedIn
- Audience: Tech professionals, founders, recruiters, investors in India & globally
- Tone: Professional, authoritative, thought-provoking — not promotional, not casual
- Language: Professional English with personality — confident but humble
- Niche: AI Tools, Productivity, Startup Insights, Tech Trends, Developer Culture

POST TYPES (alternate between these):
1. Hot Take — Bold opinion on trending tech topic
2. Personal Story — Relatable founder/developer experience with a lesson
3. How-To / Framework — Actionable insights in a structured format
4. Industry Insight — Data-backed observation about tech trends
5. Contrarian View — Challenge a popular belief with reasoning

STRUCTURE:
- Lines 1-3: HOOK — Bold statement, question, or surprising fact (MUST grab attention)
- Lines 4-6: CONTEXT — Why this matters, what changed, or personal connection
- Lines 7-12: INSIGHT — 3 key points or the main breakdown
- Lines 13-15: CONCLUSION — The takeaway or big picture
- Line 16: CTA — Question to spark comments
- End: 5-7 hashtags

LINKEDIN BEST PRACTICES:
- First 3 lines are critical — most people read without clicking "see more"
- Use line breaks between thought groups for readability
- Use specific numbers: "3 ways", "47% faster", "2 years of"
- Keep paragraphs short (1-3 lines each)
- End with a question to drive comments (boosts reach)
- Hashtags: mix of large (1M+), medium (100k-1M), niche (<100k)

OUTPUT FORMAT — always respond in this exact structure:

📌 TOPIC: [topic name]
🔥 TYPE: [Hot Take / Personal Story / How-To / Industry Insight / Contrarian View]
📊 ENGAGEMENT POTENTIAL: High / Medium / Low

━━━ 📝 LINKEDIN POST ━━━

[Line 1 — Hook]
[Line 2 — Hook contd.]

[Line 3 — Context start]
[Line 4 — Context contd.]

[Line 5 — Insight 1]
[Line 6 — Insight 2]
[Line 7 — Insight 3]

[Line 8 — Conclusion / Takeaway]

[Line 9 — CTA question]

━━━ #️⃣ HASHTAGS ━━━
[5-7 hashtags — 1 large 1M+, 2-3 medium 100k-1M, 2 niche <100k]`;

// ─── State stores ─────────────────────────────────────────────────────────────
const userSessions = {};
const linkedinSessions = {};

// ─── Helper: call Claude API ──────────────────────────────────────────────────
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

  // Keep last 4 exchanges in memory (rolling window of 8 messages)
  userSessions[chatId] = [
    ...history,
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantText },
  ].slice(-8);

  return assistantText;
}

// ─── Helper: generate LinkedIn post ────────────────────────────────────────────
async function generateLinkedInPost(userMessage, chatId) {
  const history = linkedinSessions[chatId] || [];

  const messages = [
    { role: "system", content: LINKEDIN_SYSTEM_PROMPT },
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

  // Keep last 4 exchanges
  linkedinSessions[chatId] = [
    ...history,
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantText },
  ].slice(-8);

  return assistantText;
}

// ─── Helper: generate image ───────────────────────────────────────────────────
async function generateImage(prompt) {
  const model =
    process.env.LINKEDIN_IMAGE_MODEL || "black-forest-labs/flux-dev";
  const size = process.env.LINKEDIN_IMAGE_SIZE || "1024x1024";

  const response = await openrouter.images.generate({ model, prompt, n: 1, size });
  const imageUrl = response.data[0].url;

  const imgRes = await fetch(imageUrl);
  return Buffer.from(await imgRes.arrayBuffer());
}

// ─── Helper: extract topic from post output ───────────────────────────────────
function extractTopic(text) {
  const match = text.match(/📌 TOPIC:\s*(.+)/);
  return match ? match[1].trim() : null;
}

// ─── Helper: send post with optional image ────────────────────────────────────
async function sendLinkedInPost(chatId, postText, imagePrompt) {
  await bot.sendMessage(chatId, postText, { parse_mode: "Markdown" });

  if (imagePrompt) {
    try {
      const imgBuffer = await generateImage(imagePrompt);
      await bot.sendPhoto(chatId, imgBuffer, {
        caption: `🎨 *AI-generated image for this post*\n\n_"${imagePrompt}"_`,
        parse_mode: "Markdown",
      });
    } catch (imgErr) {
      console.error("Image generation failed:", imgErr);
      await bot.sendMessage(
        chatId,
        `⚠️ *Couldn't generate image.*\nYou can post the text above directly on LinkedIn.`,
        { parse_mode: "Markdown" }
      );
    }
  }
}

// ─── Helper: get today's date string ─────────────────────────────────────────
function getTodayString() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

// ─── /start command ───────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || "Creator";

  bot.sendMessage(
    chatId,
    `🎬 *Hey ${firstName}! Welcome to your Content Bot.*\n\n` +
      `I generate content for your tech brand — Instagram Reels scripts AND LinkedIn posts, with optional AI-generated images.\n\n` +
      `*📱 Instagram Reels:*\n` +
      `📅 /today — Today's reel (AI picks trending topic)\n` +
      `🎯 /topic [idea] — Script for a specific topic\n` +
      `💡 /ideas — 5 hot reel ideas for this week\n` +
      `🔄 /regenerate — Fresh version of last script\n\n` +
      `*💼 LinkedIn Posts:*\n` +
      `📅 /li-today — Today's LinkedIn post (trending tech topic)\n` +
      `🎯 /li-topic [idea] — Post for a specific topic\n` +
      `🔄 /li-regenerate — Fresh version of last post\n\n` +
      `❓ /help — Show all commands\n\n` +
      `_Start with_ /today _or_ /li-today _to get started!_`,
    { parse_mode: "Markdown" }
  );
});

// ─── /help command ────────────────────────────────────────────────────────────
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `📖 *Commands*\n\n` +
      `*📱 Instagram Reels*\n` +
      `/today — Today's reel script (AI picks trending topic)\n` +
      `/topic [idea] — Script for a custom topic\n` +
      `   _e.g. /topic ChatGPT vs Gemini_\n` +
      `/ideas — 5 reel ideas for this week\n` +
      `/regenerate — Fresh version of last script\n` +
      `/niche [category] — Focus on a niche\n` +
      `   _e.g. /niche AI tools_\n\n` +
      `*💼 LinkedIn Posts*\n` +
      `/li-today — Today's LinkedIn post (AI picks trending topic)\n` +
      `/li-topic [idea] — Post for a custom topic\n` +
      `   _e.g. /li-topic AI in healthcare_\n` +
      `/li-regenerate — Fresh version of last post\n\n` +
      `💬 Or just *type any topic freely* and I'll script it!\n\n` +
      `_LinkedIn posts include an AI-generated image! (if image model is configured)_`,
    { parse_mode: "Markdown" }
  );
});

// ─── /today command ───────────────────────────────────────────────────────────
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

// ─── /topic command ───────────────────────────────────────────────────────────
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

// ─── /ideas command ───────────────────────────────────────────────────────────
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

// ─── /regenerate command ──────────────────────────────────────────────────────
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

// ─── /niche command ───────────────────────────────────────────────────────────
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

// ─── /li-today command ────────────────────────────────────────────────────────
bot.onText(/\/li-today/, async (msg) => {
  const chatId = msg.chat.id;
  const today = getTodayString();

  const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);
  bot.sendChatAction(chatId, "typing");

  try {
    const prompt = `Today is ${today}. I need a LinkedIn post for my tech company's page.
    Pick the MOST relevant, trending, or timely tech topic for today — something that would spark conversations on LinkedIn right now for an Indian tech audience.
    Choose from: AI tools, productivity hacks, programming insights, startup stories, gadget news, or tech industry trends.`;

    const post = await generateLinkedInPost(prompt, chatId);
    clearInterval(typing);

    const topic = extractTopic(post) || "today's trending tech topic";
    const imagePrompt = `Professional LinkedIn post banner, tech topic: ${topic}, minimalist corporate style, blue and white tones, modern tech elements, clean geometric design, 3D render quality, suitable for a professional social media post`;

    await sendLinkedInPost(chatId, `📅 *Today's LinkedIn Post — ${today}*\n\n${post}`, imagePrompt);

    await bot.sendMessage(
      chatId,
      `✅ LinkedIn post ready${process.env.LINKEDIN_IMAGE_MODEL ? " with image!" : "!"} Use /li-regenerate for a fresh angle, or /li-topic [idea] for a custom topic.`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    clearInterval(typing);
    console.error(err);
    bot.sendMessage(chatId, `❌ Something went wrong. Please try again in a moment.`);
  }
});

// ─── /li-topic command ────────────────────────────────────────────────────────
bot.onText(/\/li-topic (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[1].trim();

  const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);
  bot.sendChatAction(chatId, "typing");

  try {
    const prompt = `Create a LinkedIn post for my tech company about: "${topic}".
    Make it insightful, professional, and optimised for LinkedIn's tech audience in India.`;

    const post = await generateLinkedInPost(prompt, chatId);
    clearInterval(typing);

    const imagePrompt = `Professional LinkedIn post banner, tech topic: ${topic}, minimalist corporate style, blue and white tones, modern tech elements, clean geometric design, 3D render quality, suitable for a professional social media post`;

    await sendLinkedInPost(chatId, `🎯 *LinkedIn Post — ${topic}*\n\n${post}`, imagePrompt);
  } catch (err) {
    clearInterval(typing);
    console.error(err);
    bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
  }
});

// ─── /li-regenerate command ───────────────────────────────────────────────────
bot.onText(/\/li-regenerate/, async (msg) => {
  const chatId = msg.chat.id;

  if (!linkedinSessions[chatId] || linkedinSessions[chatId].length === 0) {
    return bot.sendMessage(chatId, `⚠️ No previous LinkedIn post found. Use /li-today or /li-topic first!`);
  }

  const typing = setInterval(() => bot.sendChatAction(chatId, "typing"), 4000);
  bot.sendChatAction(chatId, "typing");

  try {
    const prompt = `Regenerate a completely different version of the last LinkedIn post. Use a different hook, different angle, different post type. Make it feel fresh with a different tone and CTA.`;

    const post = await generateLinkedInPost(prompt, chatId);
    clearInterval(typing);

    const topic = extractTopic(post) || "the same topic";
    const imagePrompt = `Professional LinkedIn post banner, tech topic: ${topic}, minimalist corporate style, blue and white tones, modern tech elements, clean geometric design, 3D render quality`;

    await sendLinkedInPost(chatId, `🔄 *Regenerated LinkedIn Post*\n\n${post}`, imagePrompt);
  } catch (err) {
    clearInterval(typing);
    console.error(err);
    bot.sendMessage(chatId, `❌ Something went wrong. Try again!`);
  }
});

// ─── Free-text fallback ───────────────────────────────────────────────────────
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

console.log("🤖 Reels Bot is running...");
