import express from 'express';
import OpenAI from 'openai';
import Question from '../models/Question.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate question using AI
router.post('/generate-question', authenticate, async (req, res) => {
  try {
    const { language, subject, topic, difficulty } = req.body;

    if (!language || !subject || !topic || !difficulty) {
      return res.status(400).json({ message: 'Barcha maydonlar to\'ldirilishi kerak' });
    }

    // Check quota
    const user = await User.findById(req.userId);
    if (user.usedQuota >= user.quota) {
      return res.status(403).json({ 
        message: 'Kvota tugadi. Qo\'shimcha kvota olish uchun to\'lov qiling',
        quota: user.quota,
        usedQuota: user.usedQuota
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'AI API kaliti sozlangan emas' });
    }

    // Prepare prompt based on language
    const languageNames = {
      qoraqalpoq: 'Qoraqalpoq',
      uzbek: 'O\'zbek',
      russian: 'Русский',
      english: 'English'
    };

    const difficultyNames = {
      easy: 'Oson',
      medium: 'O\'rtacha',
      hard: 'Qiyin'
    };

    const prompt = `Foydalanuvchi belgilagan tilda savol yarat:
Til: ${languageNames[language] || language}
Fan: ${subject}
Mavzu: ${topic}
Qiyinchilik: ${difficultyNames[difficulty] || difficulty}

Output JSON formatda quyidagicha:
{
  "questionText": "Savol matni",
  "options": {
    "A": "Variant A",
    "B": "Variant B",
    "C": "Variant C",
    "D": "Variant D"
  },
  "correctAnswer": "A"
}

Cheklovlar:
- Tilga mos bo'lsin
- Aniqlikni yo'qotmasin
- Takrorlanmasin
- To'g'ri javob bitta bo'lsin`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Siz test savollari yaratuvchi yordamchisiz. Faqat JSON formatda javob bering, boshqa matn yo\'q.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content.trim();
    let questionData;
    
    // Try to parse JSON from response
    try {
      // Remove markdown code blocks if present
      const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      questionData = JSON.parse(cleanText);
    } catch (parseError) {
      return res.status(500).json({ 
        message: 'AI javobini tahlil qilishda xatolik',
        error: responseText
      });
    }

    // Validate question data
    if (!questionData.questionText || !questionData.options || !questionData.correctAnswer) {
      return res.status(500).json({ message: 'AI tomonidan yaratilgan savol noto\'g\'ri formatda' });
    }

    // Create question
    const question = new Question({
      questionText: questionData.questionText,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer.toUpperCase(),
      subject,
      topic,
      difficulty,
      language,
      createdBy: req.userId,
      status: 'pending'
    });

    await question.save();

    // Update user quota
    user.usedQuota += 1;
    await user.save();

    res.status(201).json({
      message: 'Savol yaratildi',
      question,
      quota: {
        total: user.quota,
        used: user.usedQuota,
        remaining: user.quota - user.usedQuota
      }
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      message: 'AI savol yaratishda xatolik', 
      error: error.message 
    });
  }
});

export default router;
