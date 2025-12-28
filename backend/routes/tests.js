import express from 'express';
import Test from '../models/Test.js';
import Question from '../models/Question.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Start test
router.post('/start', authenticate, async (req, res) => {
  try {
    const { subject, topic, difficulty, language, count = 20 } = req.body;

    const filter = { status: 'approved' };
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;

    const questions = await Question.find(filter)
      .limit(parseInt(count))
      .select('-correctAnswer'); // Don't send correct answer to client

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Savollar topilmadi' });
    }

    const test = new Test({
      userId: req.userId,
      questions: questions.map(q => ({
        questionId: q._id
      }))
    });

    await test.save();

    res.status(201).json({
      message: 'Test boshlandi',
      testId: test._id,
      questions: questions.map(q => ({
        id: q._id,
        questionText: q.questionText,
        options: q.options,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Submit test
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: 'A', ... }

    const test = await Test.findById(req.params.id).populate('questions.questionId');
    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    if (test.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Bu test sizga tegishli emas' });
    }

    if (test.status === 'completed') {
      return res.status(400).json({ message: 'Test allaqachon yakunlangan' });
    }

    let correctCount = 0;
    const totalQuestions = test.questions.length;

    // Evaluate answers
    for (let i = 0; i < test.questions.length; i++) {
      const questionItem = test.questions[i];
      const userAnswer = answers[questionItem.questionId._id.toString()];

      if (userAnswer) {
        questionItem.userAnswer = userAnswer;
        questionItem.isCorrect = userAnswer.toUpperCase() === questionItem.questionId.correctAnswer;
        if (questionItem.isCorrect) {
          correctCount++;
        }
      }
    }

    // Calculate score: (CorrectAnswers / TotalQuestions) * MaxScore
    const score = Math.round((correctCount / totalQuestions) * test.maxScore);

    test.score = score;
    test.status = 'completed';
    test.completedAt = new Date();

    await test.save();

    res.json({
      message: 'Test yakunlandi',
      test: {
        id: test._id,
        score,
        maxScore: test.maxScore,
        correctCount,
        totalQuestions,
        percentage: Math.round((correctCount / totalQuestions) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Get test history
router.get('/history', authenticate, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.userId })
      .populate('questions.questionId', 'questionText subject topic difficulty')
      .sort({ completedAt: -1, startedAt: -1 })
      .limit(50);

    res.json(tests.map(test => ({
      id: test._id,
      score: test.score,
      maxScore: test.maxScore,
      status: test.status,
      startedAt: test.startedAt,
      completedAt: test.completedAt,
      totalQuestions: test.questions.length
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Get test details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('questions.questionId');

    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    if (test.userId.toString() !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Bu test sizga tegishli emas' });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

export default router;
