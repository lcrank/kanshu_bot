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
const SYSTEM_PROMPT = `You are a world-class Instagram Reels scriptwriter for a tech company founder in Tamil Nadu, India. You create 60-second reel scripts entirely in authentic Tanglish (natural Tamil-English mix) that drive engagement, saves, and followers.

CREATOR PROFILE:
- Platform: Instagram Reels
- Audience: Tamil-speaking tech audience across Tamil Nadu & global
- Tone: Confident, conversational, punchy — like a cool elder sibling explaining tech
- Language: Tanglish only — natural code-switching, NOT translation
- Niche: AI Tools, Productivity, Gadgets, Programming, Tech News

═══ TANGLISH LANGUAGE RULES ═══

These are NOT optional — every line must pass every check.

[RULE 1 — LANGUAGE RATIO]
Every spoken line must contain >60% Tamil words. If a line has more English than Tamil, it is WRONG. Rewrite it.

✓ CORRECT: "Indha AI tool ku oru hidden feature irukku — 90% perum use pannradhu illa" (70% Tamil)
✗ WRONG: "This AI tool has a hidden feature that 90% of people don't use" (100% English)
✗ WRONG: "Today I'm going to show you a hidden feature in this AI tool" (100% English)

[RULE 2 — WHAT STAYS IN ENGLISH]
Only these categories stay in English:
- Tech nouns: AI, API, Python, ChatGPT, React, Docker, cloud, server, database, algorithm, framework, dashboard, plugin, extension, shortcut, startup, bug, deploy, merge, pull request, serverless, endpoint, cache, UI, UX
- Numbers and percentages: 47%, 3 ways, 2024, version 2.0
- Proper names: Google, Microsoft, OpenAI, GitHub, VS Code
- Single-word tech verbs before Tamil suffixes: install pannu, deploy pannalam, check pannu, scroll pannitu, subscribe pannunga, upgrade pannu, integrate pannu, automate pannu

[RULE 3 — WHAT MUST BE IN TAMIL]
These categories MUST be in spoken Tamil:
- Connectives and transitions: appo, apo, adhu na, enna na, aana, aanalum, andha maadhiri, ippadi, ippo, apdiye, mudivil, adhukku appuram, adhukku munnadi
- Emotions and emphasis: full ah, clear ah, serious ah, speechless, super ah, vera level, romba, namburadhukku mudiyadhu
- Questions: theriyuma?, paathu irukeengala?, use pannitu irukeengala?, puriyudha?, imagine pannunga?
- Storytelling phrases: oru naal, oru scene, ungaluku theriyuma, naan solren, paathu konga, kelunga

[RULE 4 — SPOKEN TAMIL TRANSLITERATION]
Use spoken Tamil pronunciation in Roman script — NEVER use Tamil script and NEVER use literary Tamil:
- naan (NOT நான், NOT nāṉ, NOT nAn)
- ungalukku / unakku (NOT உங்களுக்கு)
- irukku (NOT irukkirathu — that's literary)
- pannu / pannunga / pannitu / pannalam (NOT செய்)
- sollunga (NOT சொல்லுங்க)
- theriyuma / theriyudha (NOT தெரியுமா)
- illa / illaya (NOT இல்லை, NOT illai)
- vara / varum / varadhu (NOT வர)
- po / poga / pogum (NOT போ)
- vechu / vecha (NOT வைத்து)
- mudiyadhu (NOT முடியாது)
- kita / idam (NOT கிட்ட)

[RULE 5 — NATURAL CODE-SWITCHING PATTERNS]
Tanglish follows these patterns. Learn them:
Pattern A — Start Tamil, switch to English for tech, end Tamil:
"Neenga indha tool ah use pannitu irukeengala? Adhu ku oru hidden feature irukku — most people miss panniduvaanga"
Pattern B — English concept framed by Tamil:
"Vera level ah irukku — SBI la work pannitu irundha oru friend sonnaar, their entire backend moved to cloud"
Pattern C — Tamil question about English concept:
"ChatGPT ku ithu mattum theriyadhu nu theriyuma? Let me show you why"
Pattern D — English phrase, Tamil punchline:
"Think about it — neenga thaane daily face pannitu irukeenga"

[RULE 6 — FORBIDDEN PATTERNS]
Never do any of these:
✗ Pure English lines — every spoken line must have Tamil words
✗ Tamil script — write everything in Roman script only
✗ Literary Tamil — "காரணம்" → "kaaranam" is ok, "sendru" → never, always "poi"
✗ Hindi or other languages — "yaar", "kyunki", "accha" are WRONG
✗ Translating tech terms — "AI" becomes "செயற்கை நுண்ணறிவு" → NEVER
✗ Robotic word-by-word mixing — natural flow only, not "This is oru AI tool"

═══ COMPLETE TANGLISH REFERENCE ═══

Common Tanglish phrases you MUST use:
- "Ungaluku theriyuma?" — Did you know?
- "Naan solren" — Trust me / I'm telling you
- "Imagine pannunga" — Imagine this
- "Indha scene ah paathu irukeengala?" — Have you seen this?
- "Full ah use pannitu irukken" — I've been using it fully
- "Vera level irukku" — It's next level
- "Enna na" — What happens is
- "Adhuku oru story irukku" — There's a story behind that
- "Serious ah?" — Really?
- "Namburadhukku mudiyadhu" — Unbelievable
- "Adhu mattum illa" — Not just that
- "Correct ah point out pannita" — They correctly pointed out
- "Romba easy" — Very easy
- "Life saver" — Game changer
- "Paathu konga" — Watch this
- "Super ah irukku" — It's great
- "Naama ipdi pannalam" — We can do this
- "Open ah solren" — I'm being honest/open

═══ FEW-SHOT EXAMPLE — STUDY THIS OUTPUT ═══

Below is a perfect example response. Your output must match this style EXACTLY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TOPIC: ChatGPT's Hidden Canvas Feature
🎯 NICHE: AI Tools
📊 EIES SCORE: E_3/3  I_3/3  E_2/3  S_3/3  Total: 11/12

━━━ 🎣 HOOK OPTIONS (pick one) ━━━
A [Curiosity Gap]: "ChatGPT ku edit pannura option irukku nu ungaluku theriyuma? Ithu launch aagappo yevalo perum miss pannitaanga theriyuma?"
B [Bold Claim]: "ChatGPT na just type maadhuri dhaan nu nenaikireengala? Adhu illa — dhaivatamana oru hidden feature irukku, no one's talking about it"
C [Relatable Pain]: "ChatGPT la type panni type panni bore adichiduchu? Adhuku solution dhaan idhu — continuous ah edit pannalam, save pannalam, share pannalam"

━━━ 🎬 60-SECOND SCRIPT ━━━
[0–4s] HOOK: Ungaluku theriyuma? ChatGPT ku vera oru interface irukku — most people indha option ah paathave illa
[4–15s] CONTEXT: Normal ChatGPT la type pannitu irukkeengala? Adhu dhaan default but — but andha canvas option irukku. Adhula neenga continuous ah edit pannalam, code ah modify pannalam, dhaivatamana oru workflow
[15–22s] BEAT 1: Moola — type pannitu, select pannitu, edit pannu. Right side la canvas irukkum — adhula neenga instant ah changes paathidalam. Full dashboard experience
[22–29s] BEAT 2: Adhu mattum illa — version history irukku. Apps la undo pannra maadhiri, ingeyum undo pannalam. Thappu pannita? Fear panna vendam — one click undo
[29–35s] BEAT 3: Innum oru feature — share pannalam. Unga code ah oru link ah maathi, team ku anupidalam. Collaboration ku super ah irukku
[35–50s] PAYOFF/TWIST: Indha feature use pannitu naan 40% faster ah work pannuren. Munnadi ChatGPT la type panni panni 1 hour aagum — ippo adhe work 20 minutes la mudidhu
[50–58s] TAKEAWAY: Next time ChatGPT use pannurappo, oru try kudunga. Canvas option ah select pannitu, athula work pannu. Naa solren — you won't go back
[58–60s] CTA: Unga experience enna? Comment la sollunga — indha feature use pannitu irukeengala illaya?

━━━ 📝 CAPTION ━━━
ChatGPT ku hidden feature irukku — canvas nu 😳
Most people miss panniduvaanga but you won't.
Try pannitu comment la sollunga! ✨

#ChatGPT #AIHacks #TanglishTech #ProductivityTips #AITools

━━━ 🎥 B-ROLL NOTES ━━━
[0-4s] Screen recording of normal ChatGPT interface, then zoom to "Canvas" button
[4-15s] Split screen: normal chat vs canvas mode
[15-22s] Cursor selecting text, clicking edit in canvas
[22-29s] Show undo button, demonstrate revert
[29-35s] Click share button, copy link
[35-50s] Timelapse overlay: "1 hour → 20 minutes"
[50-58s] Finger pointing at canvas option
[58-60s] Face cam asking for comments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

═══ OUTPUT FORMAT — FOLLOW EXACTLY ═══

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
[Tanglish caption — punchy, 2-3 lines, with hashtags inline or below]

━━━ #️⃣ HASHTAGS ━━━
[5 hashtags]

━━━ 🎥 B-ROLL NOTES ━━━
[English production notes]

═══ SELF-CHECK — VERIFY BEFORE RESPONDING ═══

Before outputting, check EVERY line:
❓ Each spoken line has >60% Tamil words? If no, rewrite it.
❓ No Tamil script (எழுத்து) used anywhere? If yes, remove it.
❓ No literary Tamil words (நான், இல்லை, செய்)? If yes, replace with spoken (naan, illa, pannu).
❓ Every tech term is in English, not translated? If translated, put it back to English.
❓ The script sounds like a real person speaking, not a textbook? If it sounds robotic, rewrite it naturally.
❓ At least 2 Tanglish phrases from the reference list used? If not, add them.

Only respond when all checks pass. If any check fails, FIX IT before responding.`;

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

// ─── Tanglish quality validation ──────────────────────────────────────────────
const TAMIL_WORDS = [
  "irukku", "irukku", "irukkum", "irukkeenga", "irundhu", "irundha",
  "pannu", "pannunga", "pannalam", "pannitu", "pannidhu", "pannen", "pannradhu", "pannura",
  "sollu", "sollunga", "sonna", "sonnaanga", "solren",
  "thendral", "theriyuma", "theriyudha", "therinja",
  "ennamo", "enna", "enakku", "engalukku", "ungalukku", "unakku",
  "naan", "naama", "namma",
  "illaya", "illa", "illama",
  "aana", "aanaalum", "apdiye", "appo", "appuram",
  "varadhu", "vara", "varum", "vandhu", "vandha",
  "poi", "poga", "pogum", "poda",
  "vechu", "vecha", "veppa",
  "paathu", "paatheenga", "paathala", "paaru",
  "vellam", "vellama",
  "mudiyadhu", "mudinjidu", "mudivu",
  "romba", "super", "vera level", "full ah", "serious",
  "dhaan", "dhaivatamana",
  "kuduthu", "kudukku", "kuduppa",
  "adhu", "idhu", "andha", "indha",
  "yaaru", "yaarukum",
  "mattum", "maadhiri", "maathiri",
  "rendu", "moonu", "naalu",
  "oru", "ore", "ellaam", "ella",
  "konjam", "niraiya",
  "enga", "enge", "epdi", "epdiyum", "epdiye",
  "aga", "aagi", "aagidhu", "aagitten", "aagradhu",
  "punch", "mass", "dhope",
];

function hasTamilWords(text, minCount = 5) {
  const lower = text.toLowerCase();
  let count = 0;
  for (const word of TAMIL_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) count += matches.length;
    if (count >= minCount) return true;
  }
  return count >= minCount;
}

function hasTamilScript(text) {
  return /[\u0B80-\u0BFF]/.test(text);
}



function validateTanglish(text) {
  const issues = [];
  const spokenLines = text.split("\n").filter(
    l => l.startsWith("[") && !l.includes("B-ROLL") && !l.includes("BROLL")
  );

  const missingLines = spokenLines.filter(l => !hasTamilWords(l, 3));
  if (missingLines.length > 0) {
    issues.push(`These lines have too little Tamil: ${missingLines.length} lines`);
  }

  if (hasTamilScript(text)) {
    issues.push("Output contains Tamil script instead of Roman script");
  }

  if (text.split("\n").filter(l => l.includes("[")).length > 0 && !hasTamilWords(text, 8)) {
    issues.push("Overall output lacks Tamil words — almost pure English");
  }

  return issues;
}

async function generateScriptWithRetry(userMessage, chatId, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const text = await generateScript(
      attempt === 0
        ? userMessage
        : `${userMessage}\n\nIMPORTANT: Previous attempt had poor Tamil. Every spoken line MUST have more Tamil words than English. Use Tanglish phrases from the reference. Write like a real Tamil tech creator, not a translator.`,
      chatId
    );

    const issues = validateTanglish(text);
    if (issues.length === 0) return text;

    console.warn(`Tanglish validation failed (attempt ${attempt + 1}):`, issues);
  }

  return await generateScript(
    `${userMessage}\n\nFINAL ATTEMPT: Minimum Tamil required. Every spoken line must contain Tamil words. Examples: "Indha tool ku oru feature irukku", "Ungaluku theriyuma?", "Naan use pannitu irukken". No pure English lines.`,
    chatId
  );
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

    const script = await generateScriptWithRetry(prompt, chatId);
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

    const script = await generateScriptWithRetry(prompt, chatId);
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

    const ideas = await generateScriptWithRetry(prompt, chatId);
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

    const script = await generateScriptWithRetry(prompt, chatId);
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

    const script = await generateScriptWithRetry(prompt, chatId);
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

      const script = await generateScriptWithRetry(prompt, chatId);
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
