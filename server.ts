import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous payload limit for multimodal image uploads (handwritten notes, diagrams)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize GoogleGenAI SDK with server-side environment key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to check for API key
function checkApiKey(res: Response): boolean {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
    });
    return false;
  }
  return true;
}

// Resilient wrapper with retry for transient 503/high-demand errors
async function callGeminiWithRetry(params: any, maxRetries = 2): Promise<any> {
  let attempt = 0;
  let lastError: any = null;

  while (attempt <= maxRetries) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      const errorStr = JSON.stringify(err);
      const isTransient =
        errorStr.includes('503') ||
        errorStr.includes('UNAVAILABLE') ||
        errorStr.includes('high demand') ||
        errorStr.includes('RESOURCE_EXHAUSTED');

      if (isTransient && attempt < maxRetries) {
        attempt++;
        // Wait 1.2s before retry
        await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'EduGenie',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Chat Assistant endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      messages = [],
      subject = 'General Academic',
      level = 'Intermediate',
      language = 'en',
      action = 'standard',
    } = req.body;

    let languageDirective =
      'Respond in clear, encouraging English with proper academic structure.';
    if (language === 'ta') {
      languageDirective =
        'Respond predominantly in natural, clear Tamil (தமிழ்). Include English technical terminology in parentheses where appropriate (e.g. அல்காரிதம் (Algorithm), மாறிகள் (Variables)). Ensure the Tamil is natural, accurate, and easy for college students to read.';
    } else if (language === 'bilingual') {
      languageDirective =
        'Respond bilingually: First provide a clear, structured English explanation, followed immediately by a concise Tamil (தமிழ்) summary and key takeaways.';
    }

    let levelDirective = '';
    if (level === 'Beginner') {
      levelDirective =
        'Student is a BEGINNER: Explain like you are talking to someone new to the subject. Use relatable real-world analogies, intuitive step-by-step examples, avoid dense academic jargon, and break formulas down into plain words.';
    } else if (level === 'Advanced') {
      levelDirective =
        'Student is ADVANCED: Provide rigorous, in-depth academic depth. Include formal definitions, algorithmic complexity, mathematical formulation, edge cases, underlying architecture, and best practices.';
    } else {
      levelDirective =
        'Student is INTERMEDIATE: Provide balanced college-level depth. Balance clear intuitive conceptual explanations with correct technical terms, structured examples, and practical applications.';
    }

    let actionDirective = '';
    if (action === 'simplify') {
      actionDirective =
        'CRITICAL: The student requested a MUCH SIMPLER explanation. Strip out complex terminology, use an everyday visual analogy, and explain in simple 3-4 steps with a concrete scenario.';
    } else if (action === 'step_by_step') {
      actionDirective =
        'CRITICAL: Provide a numbered step-by-step breakdown. For math or coding, show every individual intermediate calculation or line-by-line explanation.';
    } else if (action === 'analogy') {
      actionDirective =
        'CRITICAL: Anchor your entire answer around an engaging, intuitive real-world analogy before connecting it back to technical principles.';
    } else if (action === 'tamil_translate') {
      actionDirective =
        'CRITICAL: Translate the previous explanation into natural, student-friendly Tamil (தமிழ்) with key technical terms glossed in English.';
    }

    const systemInstruction = `You are EduGenie, an exceptional, encouraging, and patient AI learning assistant for students.
Your mission is to make learning crystal clear, interactive, and confidence-building.

Context:
- Current Subject: ${subject}
- Target Student Level: ${level}
- Target Language: ${language}

Behavioral Guidelines:
1. Explain difficult concepts in simple language without condescension.
2. Structure your replies beautifully: Use bold highlights, bullet points, clean markdown code blocks (with language specified), and markdown tables when comparing concepts.
3. Give concrete examples (code snippets, math workings, real-world analogies) wherever useful.
4. If equations are used, write them clearly with step-by-step reasoning.
5. Offer helpful follow-up options at the end (e.g., "Would you like me to generate a practice quiz on this, show a simpler analogy, or give a code implementation?").
6. Tone: Warm, supportive, scholarly yet accessible.

Level instructions:
${levelDirective}

Language instructions:
${languageDirective}

Special modifier:
${actionDirective}
`;

    // Format chat contents for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate an answer right now. Please try again.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error.message || 'Failed to process chat with EduGenie',
    });
  }
});

// 3. Summarizer endpoint
app.post('/api/summarize', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      content,
      mode = 'detailed', // 'concise', 'detailed', 'flashcards', 'exam_cram'
      subject = 'General Academic',
      level = 'Intermediate',
      language = 'en',
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Please provide study material to summarize.' });
    }

    const languagePrompt =
      language === 'ta'
        ? 'Provide the output in fluent, student-friendly Tamil (தமிழ்) with English technical terms in brackets.'
        : language === 'bilingual'
        ? 'Provide the summary in English, followed by a Tamil (தமிழ்) quick revision summary.'
        : 'Provide the output in clean, crisp English.';

    const systemInstruction = `You are EduGenie Smart Summarizer.
Your job is to condense college and school study materials, textbook chapters, or lecture notes into high-yield, structured study summaries.

Mode: ${mode}
Subject: ${subject}
Level: ${level}
Language: ${languagePrompt}

Instructions by mode:
- concise: High-speed executive summary (max 250 words), 5 golden bullet points, and 1 core takeaway.
- detailed: Deep hierarchical outline with Main Concept, Core Mechanism, Step-by-Step Breakdown, Key Formulas/Definitions, and Practical Example.
- flashcards: Extract 5 to 7 high-impact Q&A flashcards perfect for active recall and revision.
- exam_cram: Quick 5-minute pre-exam revision cheat sheet with "Must Remember" terms, common pitfalls/mistakes, and key diagrams/algorithms described simply.

Format your response with clean markdown headings (##, ###), bullet points, bold key terms, and code/math blocks where relevant.`;

    const prompt = `Please summarize the following study material:\n\n${content}`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({
      summary: response.text || 'Unable to generate summary.',
    });
  } catch (error: any) {
    console.error('Error in /api/summarize:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate study summary',
    });
  }
});

// 4. Quiz Generator endpoint (Structured JSON output via responseSchema)
app.post('/api/quiz', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      topic = 'Data Structures and Algorithms',
      subject = 'Computer Science',
      level = 'Intermediate',
      questionCount = 5,
      material = '',
      language = 'en',
    } = req.body;

    const count = Math.min(Math.max(Number(questionCount) || 5, 3), 10);

    const langInstruction =
      language === 'ta'
        ? 'Write the questions, options, hints, and explanations in clear Tamil (தமிழ்) with key technical words optionally in English brackets.'
        : 'Write the questions, options, hints, and explanations in English.';

    const prompt = `Generate a high quality academic quiz on:
Topic: "${topic}"
Subject: "${subject}"
Student Level: ${level}
Number of Questions: ${count}
${material ? `Context Material to base questions on:\n${material}` : ''}

Requirements:
- Exactly ${count} multiple choice questions (MCQs).
- Each question must have exactly 4 options.
- Ensure only one correct option and 3 plausible distractors.
- correctAnswerIndex must be an integer from 0 to 3.
- Provide a helpful "conceptHint" that guides without giving away the direct answer.
- Provide a thorough "explanation" for why the correct option is right and what common mistake students make.
- Adjust difficulty to ${level} level.
- ${langInstruction}`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            subject: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  conceptHint: { type: Type.STRING },
                },
                required: [
                  'id',
                  'question',
                  'options',
                  'correctAnswerIndex',
                  'explanation',
                  'conceptHint',
                ],
              },
            },
          },
          required: ['topic', 'subject', 'difficulty', 'questions'],
        },
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const parsedData = JSON.parse(rawJson);

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz with EduGenie',
    });
  }
});

// 5. Explain Notes / Image endpoint (Multimodal Gemini 3.8 Flash)
app.post('/api/explain-notes', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      userQuery = '',
      subject = 'General Academic',
      level = 'Intermediate',
      language = 'en',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Please provide an image of the notes or diagram.' });
    }

    // Strip header prefix if present (e.g., data:image/png;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const langInstruction =
      language === 'ta'
        ? 'Explain the notes and transcribe formulas in clear Tamil (தமிழ்). Include English technical terms in brackets for clarity.'
        : language === 'bilingual'
        ? 'Explain in English first, followed by a helpful Tamil explanation summary.'
        : 'Explain in clear, step-by-step English.';

    const systemInstruction = `You are EduGenie's Visual Academic Explainer powered by Google Gemini.
You analyze photographs or scans of handwritten notes, printed textbook pages, whiteboard sketches, mathematical proofs, circuit diagrams, flowcharts, or code blocks.

Your tasks:
1. **Transcribe & Decipher**: First transcribe what is written in the image (handwriting, printed text, formula, pseudocode, diagram labels) with high accuracy.
2. **Concept Identification**: Identify the core academic topic (Subject: ${subject}) and purpose of the notes.
3. **Step-by-Step Breakdown**: Explain the step-by-step logic, calculations, algorithm, or theory shown in the notes.
4. **Clarification of Ambiguities**: If the handwriting contains common student errors, missing steps, or shorthand, gently clarify them.
5. **Real-world Example / Intuition**: Provide a relatable analogy or application.
6. **Self-Check Question**: Provide a quick self-test question for the student to confirm they understand what the notes represented.

Tailor to student level: ${level}.
Language: ${langInstruction}`;

    const promptText = userQuery
      ? `Student's specific question about this image: "${userQuery}"\n\nPlease transcribe and explain this image thoroughly according to the system instructions.`
      : 'Please carefully transcribe, decipher, and explain the contents of these handwritten or printed notes step-by-step.';

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({
      explanation: response.text || 'Unable to decipher notes from the image.',
    });
  } catch (error: any) {
    console.error('Error in /api/explain-notes:', error);
    res.status(500).json({
      error: error.message || 'Failed to explain image notes with EduGenie',
    });
  }
});

// 6. Study Planner endpoint (Structured JSON output via responseSchema)
app.post('/api/study-planner', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      subjects = ['Mathematics', 'Computer Science'],
      examDate = '2026-11-15',
      hoursPerDay = 3,
      daysPerWeek = 5,
      currentLevel = 'Intermediate',
      weakAreas = '',
      targetGoal = 'Score High / Master Concepts',
      language = 'en',
    } = req.body;

    const subjectsList = Array.isArray(subjects) ? subjects.join(', ') : String(subjects);
    const langDirective =
      language === 'ta'
        ? 'Generate all plan details, topics, and tips in Tamil (தமிழ்).'
        : 'Generate in clear English.';

    const prompt = `Create a realistic, high-yield, personalized student study schedule and revision planner:
Subjects: ${subjectsList}
Target Exam Date / Deadline: ${examDate}
Study Time Available: ${hoursPerDay} hours per day, ${daysPerWeek} days per week
Student Level: ${currentLevel}
Weak Areas needing extra attention: "${weakAreas || 'None specified, balance all core topics'}"
Student Goal: "${targetGoal}"
${langDirective}

Generate a comprehensive roadmap containing:
1. Executive Strategy Summary (methodology, spaced repetition intervals, Pomodoro advice).
2. Weekly Phase Milestones (e.g., Foundation Phase, Deep Practice Phase, Mock Tests & Cram Phase).
3. A 7-Day Day-by-Day schedule template with specific subject blocks, actionable task checklists, and revision prompts.
4. 4 High-yield exam survival habits.`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            totalStudyHoursWeekly: { type: Type.NUMBER },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  keyMilestones: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['phaseName', 'duration', 'focus', 'keyMilestones'],
              },
            },
            weeklySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  allocatedHours: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  revisionTip: { type: Type.STRING },
                },
                required: ['day', 'subject', 'topic', 'allocatedHours', 'tasks', 'revisionTip'],
              },
            },
            goldenTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'title',
            'overview',
            'totalStudyHoursWeekly',
            'phases',
            'weeklySchedule',
            'goldenTips',
          ],
        },
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const parsedData = JSON.parse(rawJson);

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/study-planner:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate study plan with EduGenie',
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`EduGenie Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
