import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Payment packages
const PAYMENT_PACKAGES = {
  basic: { quota: 50, price: 50000, name: 'Asosiy paket' },
  premium: { quota: 150, price: 120000, name: 'Premium paket' },
  unlimited: { quota: 1000, price: 300000, name: 'Cheksiz paket' }
};

// Initialize payment (Payme/Click)
router.post('/init', authenticate, async (req, res) => {
  try {
    const { package: packageType, provider } = req.body; // provider: 'payme' or 'click'

    if (!PAYMENT_PACKAGES[packageType]) {
      return res.status(400).json({ message: 'Noto\'g\'ri paket turi' });
    }

    const packageInfo = PAYMENT_PACKAGES[packageType];
    const user = await User.findById(req.userId);

    // In real implementation, you would create a payment record and get payment URL
    // For mock implementation, we'll simulate payment creation
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock payment data
    const paymentData = {
      paymentId,
      userId: user._id,
      package: packageType,
      quota: packageInfo.quota,
      amount: packageInfo.price,
      provider: provider || 'payme',
      status: 'pending',
      createdAt: new Date()
    };

    // In production, redirect to Payme/Click payment page
    // For now, return payment info (you would integrate with actual payment gateway)
    res.json({
      message: 'To\'lov yaratildi',
      paymentId,
      amount: packageInfo.price,
      quota: packageInfo.quota,
      provider: provider || 'payme',
      // In production: paymentUrl: 'https://checkout.payme.uz/...'
      paymentUrl: `/payment/checkout/${paymentId}`,
      note: 'Bu mock to\'lov tizimi. Haqiqiy integratsiya Payme/Click API bilan amalga oshirilishi kerak.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Verify payment (webhook from Payme/Click)
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { paymentId, transactionId, amount } = req.body;

    // In production, verify payment with Payme/Click API
    // For mock, we'll just approve it
    // In real implementation:
    // - Verify transaction with payment provider
    // - Check amount matches
    // - Update user quota
    // - Mark payment as completed

    const user = await User.findById(req.userId);
    
    // Mock: approve payment and add quota
    // In production, get package info from payment record
    const packageInfo = PAYMENT_PACKAGES.basic; // Default for mock
    
    user.quota += packageInfo.quota;
    await user.save();

    res.json({
      message: 'To\'lov tasdiqlandi',
      quota: user.quota,
      usedQuota: user.usedQuota
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Get payment packages
router.get('/packages', authenticate, async (req, res) => {
  try {
    const packages = Object.keys(PAYMENT_PACKAGES).map(key => ({
      id: key,
      ...PAYMENT_PACKAGES[key]
    }));

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

// Manual quota update (for testing/admin)
router.post('/add-quota', authenticate, async (req, res) => {
  try {
    const { quota } = req.body;
    const user = await User.findById(req.userId);

    user.quota += parseInt(quota) || 0;
    await user.save();

    res.json({
      message: 'Kvota qo\'shildi',
      quota: user.quota,
      usedQuota: user.usedQuota
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

export default router;
