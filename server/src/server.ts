import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 10;

type User = {
  email: string;
  hashedPassword: string;
};

const users: User[] = [];

app.use(cors());
app.use(express.json());

const validateAuthInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: 'Email and password are required' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, message: 'Invalid email format' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });
    return;
  }
  next();
};

app.post(
  '/api/login',
  validateAuthInput,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = users.find((user) => user.email === email);
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
        return;
      }
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!passwordMatch) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
        return;
      }
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error('Login error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
);

app.post(
  '/api/signup',
  validateAuthInput,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        res
          .status(409)
          .json({ success: false, message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      users.push({ email, hashedPassword });
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ success: true, token });
    } catch (error) {
      console.log('Signup error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
);

app.post('/api/landing-page', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
