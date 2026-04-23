// =============================================
// SON AFTER MOON AI — MAIN BACKEND SERVER
// India's First Multilingual AI Ecosystem
// By Rounak Ranjan
// =============================================

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors({origin:'*'}));
app.use(express.json());
app.use(express.static('public'));

// =============================================
// ANTHROPIC (CLAUDE) CLIENT
// =============================================
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// =============================================
// LANGUAGE DETECTION & SYSTEM PROMPTS
// =============================================
const getSystemPrompt = (language) => {
  const prompts = {
    hi: `Tu "Son After Moon AI" hai — India ka pehla multilingual AI ecosystem.
         Hamesha Hindi mein jawab de. Dost ki tarah baat kar. 
         Simple aur helpful reh. Har sawaal ka best jawab de.
         Tu ek intelligent, fast aur powerful AI hai.`,
    
    en: `You are "Son After Moon AI" — India's first multilingual AI ecosystem.
         Always respond in English. Be friendly and helpful.
         Give the best possible answer to every question.
         You are intelligent, fast and powerful.`,
    
    ta: `Nee "Son After Moon AI" — India's first multilingual AI ecosystem.
         Hamesha Tamil mein jawab de. Nanbare pola pesu.
         Ellaa kelvikaLukkum best answer kodu.`,
    
    te: `Meeru "Son After Moon AI" — India's first multilingual AI ecosystem.
         Hamesha Telugu lo jawabu ivvu. Snehitudi laa matlaadu.
         Prathi prashnaku best answer ivvu.`,
    
    bn: `Tumi "Son After Moon AI" — India's first multilingual AI ecosystem.
         Hamesha Bangla te uttor deo. Bondhur moto kotha bolo.
         Protiṭi prasner shera uttor deo.`,
    
    default: `You are "Son After Moon AI" — India's first multilingual AI ecosystem.
              Detect the user's language automatically and respond in the same language.
              Be friendly, helpful and intelligent. Give the best possible answer.
              You support Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati,
              Kannada, Malayalam, and 100+ other global languages.`
  };
  
  return prompts[language] || prompts.default;
};

// =============================================
// LANGUAGE DETECTION
// =============================================
const detectLanguage = (text) => {
  // Hindi detection
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  // Tamil detection  
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Telugu detection
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Bengali detection
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  // Gujarati detection
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
  // Kannada detection
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Malayalam detection
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // Default English
  return 'en';
};

// =============================================
// ROUTES
// =============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    name: 'Son After Moon AI',
    version: '1.0.0',
    message: 'India ka pehla multilingual AI ecosystem! 🌙'
  });
});

// =============================================
// CHAT API
// =============================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Detect language if not provided
    const detectedLang = language || detectLanguage(message);
    
    // Build conversation history
    const messages = conversationHistory || [];
    messages.push({
      role: 'user',
      content: message
    });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: getSystemPrompt(detectedLang),
      messages: messages
    });

    const aiResponse = response.content[0].text;

    res.json({
      success: true,
      response: aiResponse,
      language: detectedLang,
      tokens: response.usage.output_tokens
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'AI response failed',
      message: error.message 
    });
  }
});

// =============================================
// DEEP RESEARCH API
// =============================================
app.post('/api/research', async (req, res) => {
  try {
    const { topic, language } = req.body;
    
    const detectedLang = language || detectLanguage(topic);
    
    const researchPrompt = `You are a deep research expert. 
    Research the following topic thoroughly and provide:
    1. Overview/Introduction
    2. Key Facts & Data
    3. Recent Developments
    4. Expert Analysis
    5. Conclusion
    
    Respond in ${detectedLang === 'hi' ? 'Hindi' : 'the same language as the query'}.
    Topic: ${topic}`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: researchPrompt
      }]
    });

    res.json({
      success: true,
      research: response.content[0].text,
      language: detectedLang
    });

  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({ error: 'Research failed' });
  }
});

// =============================================
// CODE WRITER API
// =============================================
app.post('/api/code', async (req, res) => {
  try {
    const { prompt, language, programmingLanguage } = req.body;
    
    const codePrompt = `You are an expert programmer. 
    Write clean, efficient, well-commented code.
    Programming language: ${programmingLanguage || 'JavaScript'}
    Task: ${prompt}
    
    Provide:
    1. Complete working code
    2. Explanation of the code
    3. How to run it`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: codePrompt
      }]
    });

    res.json({
      success: true,
      code: response.content[0].text,
      programmingLanguage: programmingLanguage || 'JavaScript'
    });

  } catch (error) {
    console.error('Code error:', error);
    res.status(500).json({ error: 'Code generation failed' });
  }
});

// =============================================
// WRITE & DRAFT API
// =============================================
app.post('/api/write', async (req, res) => {
  try {
    const { prompt, type, language } = req.body;
    
    const detectedLang = language || detectLanguage(prompt);
    
    const writePrompt = `You are a professional writer. 
    Write type: ${type || 'general'}
    Language: ${detectedLang}
    Request: ${prompt}
    
    Write in a professional yet engaging style.
    Respond in the same language as the request.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: writePrompt
      }]
    });

    res.json({
      success: true,
      content: response.content[0].text,
      language: detectedLang
    });

  } catch (error) {
    console.error('Write error:', error);
    res.status(500).json({ error: 'Writing failed' });
  }
});

// =============================================
// SUMMARIZE API
// =============================================
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    const detectedLang = language || detectLanguage(text);
    
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Summarize this text in ${detectedLang === 'hi' ? 'Hindi' : 'the same language'}: ${text}`
      }]
    });

    res.json({
      success: true,
      summary: response.content[0].text,
      language: detectedLang
    });

  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

// =============================================
// QUIZ GENERATOR API
// =============================================
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, count, difficulty, language } = req.body;
    
    const detectedLang = language || detectLanguage(topic);
    
    const quizPrompt = `Generate ${count || 5} multiple choice questions about: ${topic}
    Difficulty: ${difficulty || 'medium'}
    Language: ${detectedLang}
    
    Format each question as JSON:
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": "A",
      "explanation": "..."
    }
    
    Return a JSON array of questions.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: quizPrompt
      }]
    });

    res.json({
      success: true,
      quiz: response.content[0].text,
      topic: topic,
      language: detectedLang
    });

  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({ error: 'Quiz generation failed' });
  }
});

// =============================================
// TRANSLATE API
// =============================================
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;
    
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Translate this text to ${targetLanguage}: "${text}"
        Only provide the translation, nothing else.`
      }]
    });

    res.json({
      success: true,
      translation: response.content[0].text,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage: targetLanguage
    });

  } catch (error) {
    console.error('Translate error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// =============================================
// HEALTH & LEGAL API
// =============================================
app.post('/api/health', async (req, res) => {
  try {
    const { symptoms, language } = req.body;
    
    const detectedLang = language || detectLanguage(symptoms);
    
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a helpful health information assistant. 
               Provide general health information but always recommend 
               consulting a real doctor for medical advice.
               Respond in ${detectedLang === 'hi' ? 'Hindi' : 'the user language'}.`,
      messages: [{
        role: 'user',
        content: symptoms
      }]
    });

    res.json({
      success: true,
      guidance: response.content[0].text,
      disclaimer: 'Yeh sirf general information hai. Doctor se milna zaroori hai.',
      language: detectedLang
    });

  } catch (error) {
    console.error('Health error:', error);
    res.status(500).json({ error: 'Health guidance failed' });
  }
});

// =============================================
// FINANCE & TAX API
// =============================================
app.post('/api/finance', async (req, res) => {
  try {
    const { query, language } = req.body;
    
    const detectedLang = language || detectLanguage(query);
    
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a financial advisor AI for India. 
               Help with tax, investment, savings, and financial planning.
               Always recommend consulting a CA/financial advisor for major decisions.
               Respond in ${detectedLang === 'hi' ? 'Hindi' : 'the user language'}.`,
      messages: [{
        role: 'user',
        content: query
      }]
    });

    res.json({
      success: true,
      advice: response.content[0].text,
      disclaimer: 'Consult a CA/financial advisor for important decisions.',
      language: detectedLang
    });

  } catch (error) {
    console.error('Finance error:', error);
    res.status(500).json({ error: 'Finance guidance failed' });
  }
});

// =============================================
// PLANS API
// =============================================
app.get('/api/plans', (req, res) => {
  res.json({
    plans: [
      {
        name: 'Free',
        price_inr: 0,
        features: ['50 chat/day', '3 images/day', '5 languages', 'Basic tools']
      },
      {
        name: 'Chat Pro',
        price_inr: 99,
        features: ['Unlimited chat', '10 images/day', '22 Indian languages', 'Priority support']
      },
      {
        name: 'Creator',
        price_inr: 299,
        features: ['All Chat Pro', '100 images/day', '10 videos/day', '50 languages', 'All creative tools']
      },
      {
        name: 'Business',
        price_inr: 799,
        features: ['Everything unlimited', '100+ languages', 'API access', 'Team features', 'Analytics']
      },
      {
        name: 'Enterprise',
        price_inr: 0,
        price_custom: true,
        features: ['Everything', 'White label', 'Dedicated server', '24/7 support', 'SLA guarantee']
      }
    ]
  });
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`
  🌙 SON AFTER MOON AI SERVER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Server running on port ${PORT}
  ✅ AI APIs connected
  ✅ All routes ready
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "Darkness ke baad — Naya Savera" ☀️
  `);
});

module.exports = app;
