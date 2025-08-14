import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface User {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  sub: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface RefreshTokenRecord {
  userId: string;
  hashedToken: string;
  expiresAt: Date;
  createdAt: Date;
}

export class AuthService {
  private refreshTokens = new Map<string, RefreshTokenRecord>();
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'dev-access-secret';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

    if (process.env.NODE_ENV === 'production' && 
        (this.accessTokenSecret === 'dev-access-secret' || this.refreshTokenSecret === 'dev-refresh-secret')) {
      throw new Error('Production requires proper JWT secrets to be set');
    }

    // Clean up expired refresh tokens every hour
    setInterval(() => this.cleanupExpiredTokens(), 60 * 60 * 1000);
  }

  generateTokenPair(user: User): TokenPair {
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
        type: 'access'
      },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry }
    );

    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
      tokenId: crypto.randomUUID()
    };

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    // Store hashed refresh token
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + this.parseExpiry(this.refreshTokenExpiry));
    
    this.refreshTokens.set(refreshTokenPayload.tokenId, {
      userId: user.id,
      hashedToken,
      expiresAt,
      createdAt: new Date()
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiry(this.accessTokenExpiry)
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const tokenRecord = this.refreshTokens.get(decoded.tokenId);
      if (!tokenRecord) {
        throw new Error('Refresh token not found');
      }

      if (tokenRecord.expiresAt < new Date()) {
        this.refreshTokens.delete(decoded.tokenId);
        throw new Error('Refresh token expired');
      }

      // Verify the token hash
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      if (hashedToken !== tokenRecord.hashedToken) {
        throw new Error('Invalid refresh token');
      }

      // Here you would typically fetch user from database
      // For now, we'll simulate a user lookup
      const user: User = {
        id: tokenRecord.userId,
        email: `user-${tokenRecord.userId}@example.com`, // This should come from DB
        roles: ['user'], // This should come from DB
        permissions: ['read'], // This should come from DB
        sub: tokenRecord.userId
      };

      // Remove old refresh token
      this.refreshTokens.delete(decoded.tokenId);

      // Generate new token pair
      return this.generateTokenPair(user);

    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  revokeRefreshToken(refreshToken: string): boolean {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as any;
      return this.refreshTokens.delete(decoded.tokenId);
    } catch {
      return false;
    }
  }

  revokeAllUserTokens(userId: string): number {
    let revokedCount = 0;
    for (const [tokenId, record] of this.refreshTokens) {
      if (record.userId === userId) {
        this.refreshTokens.delete(tokenId);
        revokedCount++;
      }
    }
    return revokedCount;
  }

  private cleanupExpiredTokens(): void {
    const now = new Date();
    for (const [tokenId, record] of this.refreshTokens) {
      if (record.expiresAt < now) {
        this.refreshTokens.delete(tokenId);
      }
    }
  }

  private parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 15 * 60 * 1000; // 15 minutes default
    }
  }

  getTokenStats(): { activeTokens: number; expiredTokens: number } {
    const now = new Date();
    let activeTokens = 0;
    let expiredTokens = 0;

    for (const record of this.refreshTokens.values()) {
      if (record.expiresAt >= now) {
        activeTokens++;
      } else {
        expiredTokens++;
      }
    }

    return { activeTokens, expiredTokens };
  }
}

// Permission-based access control
export const requirePermission = (permission: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!user.permissions || !user.permissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions', 
        required: permission,
        userPermissions: user.permissions || []
      });
    }

    next();
  };
};

// Role-based access control
export const requireRole = (role: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!user.roles || !user.roles.includes(role)) {
      return res.status(403).json({ 
        error: 'Insufficient role', 
        required: role,
        userRoles: user.roles || []
      });
    }

    next();
  };
};

// Enhanced JWT middleware with better error handling
export const createAuthMiddleware = (authService: AuthService) => {
  return async (req: any, res: Response, next: NextFunction) => {
    // Skip auth for public endpoints
    const publicPaths = ['/public', '/health', '/readyz', '/auth/login', '/auth/register', '/auth/refresh'];
    if (publicPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid Authorization header',
        expected: 'Bearer <token>'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-access-secret') as any;
      
      if (decoded.type !== 'access') {
        return res.status(401).json({ error: 'Invalid token type' });
      }

      req.user = {
        id: decoded.sub,
        sub: decoded.sub,
        email: decoded.email,
        roles: decoded.roles || [],
        permissions: decoded.permissions || []
      };

      next();
    } catch (error: any) {
      let errorMessage = 'Invalid token';
      let statusCode = 401;

      if (error.name === 'TokenExpiredError') {
        errorMessage = 'Token expired';
        statusCode = 401;
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Malformed token';
        statusCode = 401;
      } else if (error.name === 'NotBeforeError') {
        errorMessage = 'Token not active yet';
        statusCode = 401;
      }

      return res.status(statusCode).json({ 
        error: errorMessage,
        hint: 'Try refreshing your token or logging in again'
      });
    }
  };
};