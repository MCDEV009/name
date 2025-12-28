import express from 'express';
import Question from '../models/Question.js';
import { authenticate, requireModerator } from '../middleware/auth.js';

const router = express.Router();

// Get pending questions
router.get('/pending', authenticate, requireModerator, async (req, res) => {
  try {
    const questions = await Question.find({ status: 'pending' })
      .populate('createdBy', 'username email')
      .sort({ createdAt: 1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Get reported questions
router.get('/reported', authenticate, requireModerator, async (req, res) => {
  try {
    const questions = await Question.find({ 
      status: 'approved',
      'reports.0': { $exists: true }
    })
      .populate('createdBy', 'username email')
      .populate('reports.userId', 'username')
      .sort({ 'reports.createdAt': -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Approve question
router.post('/approve/:id', authenticate, requireModerator, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }

    question.status = 'approved';
    question.approvedAt = new Date();
    question.approvedBy = req.userId;

    await question.save();

    res.json({ message: 'Savol tasdiqlandi', question });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Deactivate question
router.post('/deactivate/:id', authenticate, requireModerator, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }

    question.status = 'deactivated';
    await question.save();

    res.json({ message: 'Savol deaktivlashtirildi', question });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Get moderation dashboard stats
router.get('/stats', authenticate, requireModerator, async (req, res) => {
  try {
    const pendingCount = await Question.countDocuments({ status: 'pending' });
    const approvedCount = await Question.countDocuments({ status: 'approved' });
    const deactivatedCount = await Question.countDocuments({ status: 'deactivated' });
    const reportedCount = await Question.countDocuments({ 
      'reports.0': { $exists: true }
    });

    res.json({
      pending: pendingCount,
      approved: approvedCount,
      deactivated: deactivatedCount,
      reported: reportedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

export default router;
