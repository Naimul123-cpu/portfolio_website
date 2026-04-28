import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

const generateTokens = (id: string) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json(req.user);
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await user.comparePassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(401).json({ message: 'Invalid old password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
