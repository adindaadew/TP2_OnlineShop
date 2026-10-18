import express from 'express';
import User from '../models/User.js';
import { generateToken, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("==========================================");
    console.error("LETAK ERROR SEBENARNYA ADA DI BARIS INI:");
    console.error(error.stack);
    console.error("==========================================");
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me  (protected route - example)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
