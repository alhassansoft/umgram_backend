import { Request, Response } from 'express';
import { register, login, rotateTokens } from '../services/authService';

export async function registerController(req: Request, res: Response) {
  try {
    // تعطيل التسجيل أثناء فترة البيتا
    return res.status(423).json({ 
      error: 'التسجيل معطل مؤقتاً - التطبيق في وضع البيتا للحسابات المختارة مسبقاً فقط',
      message: 'Registration temporarily disabled - App is in beta mode for pre-selected accounts only',
      beta: true
    });

    // الكود القديم للتسجيل (معطل مؤقتاً)
    /*
    const { email, username, password, displayName } = req.body ?? {};
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'email, username, password required' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'password must be at least 8 characters' });
    }
    const result = await register({ email, username, password, displayName });
    res.status(201).json(result);
    */
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body ?? {};
    if (!identifier || !password) {
      return res.status(400).json({ error: 'identifier and password required' });
    }
    const result = await login({ identifier, password });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
}

export async function refreshController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });
    const result = rotateTokens(refreshToken);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
}
