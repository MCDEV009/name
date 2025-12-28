import express from 'express';
import Question from '../models/Question.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all approved questions
router.get('/', async (req, res) => {
  try {
    const { subject, topic, difficulty, language, status } = req.query;
    const filter = { status: status || 'approved' };

    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;

    const questions = await Question.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username');

    if (!question) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Create question (manual)
router.post('/', authenticate, async (req, res) => {
  try {
    const { questionText, options, correctAnswer, subject, topic, difficulty, language } = req.body;

    if (!questionText || !options || !correctAnswer || !subject || !topic || !difficulty || !language) {
      return res.status(400).json({ message: 'Barcha maydonlar to\'ldirilishi kerak' });
    }

    const question = new Question({
      questionText,
      options,
      correctAnswer,
      subject,
      topic,
      difficulty,
      language,
      createdBy: req.userId,
      status: 'pending'
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Rate question
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Baho 1 dan 5 gacha bo\'lishi kerak' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }

    // Remove existing rating from this user
    question.rating.ratings = question.rating.ratings.filter(
      r => r.userId.toString() !== req.userId.toString()
    );

    // Add new rating
    question.rating.ratings.push({
      userId: req.userId,
      rating
    });

    // Calculate average
    const totalRating = question.rating.ratings.reduce((sum, r) => sum + r.rating, 0);
    question.rating.average = totalRating / question.rating.ratings.length;
    question.rating.count = question.rating.ratings.length;

    await question.save();
    res.json({ message: 'Baho qo\'shildi', rating: question.rating });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Report question
router.post('/:id/report', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }

    // Check if user already reported
    const alreadyReported = question.reports.some(
      r => r.userId.toString() === req.userId.toString()
    );
    if (alreadyReported) {
      return res.status(400).json({ message: 'Siz allaqachon shikoyat qilgansiz' });
    }

    question.reports.push({
      userId: req.userId,
      reason: reason || 'Aniqlanmagan sabab'
    });

    await question.save();
    res.json({ message: 'Shikoyat qabul qilindi' });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

export default router;
