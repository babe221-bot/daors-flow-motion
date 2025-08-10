import { ROLES, Role, User as AppUser } from './types';

/**
 * Offline authentication fallback when Supabase is unavailable
 */

const OFFLINE_USERS_KEY = 'df_offline_users';
const OFFLINE_SESSION_KEY = 'df_offline_session';

export interface OfflineUser extends AppUser {
  email: string;
  password?: string; // Hashed in real implementation
}

export interface OfflineSession {
  user: OfflineUser;
  expiresAt: number;
  createdAt: number;
}

/**
 * Get stored offline users
 */
function getOfflineUsers(): OfflineUser[] {
  try {
    const stored = localStorage.getItem(OFFLINE_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load offline users:', error);
    return [];
  }
}

/**
 * Store offline users
 */
function setOfflineUsers(users: OfflineUser[]): void {
  try {
    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('Failed to store offline users:', error);
  }
}

/**
 * Get current offline session
 */
export function getOfflineSession(): OfflineSession | null {
  try {
    const stored = localStorage.getItem(OFFLINE_SESSION_KEY);
    if (!stored) return null;
    
    const session: OfflineSession = JSON.parse(stored);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(OFFLINE_SESSION_KEY);
      return null;
    }
    
    return session;
  } catch (error) {
    console.warn('Failed to load offline session:', error);
    return null;
  }
}

/**
 * Create offline session
 */
function createOfflineSession(user: OfflineUser): OfflineSession {
  const session: OfflineSession = {
    user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  try {
    localStorage.setItem(OFFLINE_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to store offline session:', error);
  }
  
  return session;
}

/**
 * Clear offline session
 */
export function clearOfflineSession(): void {
  localStorage.removeItem(OFFLINE_SESSION_KEY);
}

/**
 * Simple hash function for passwords (NOT for production use)
 */
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

/**
 * Offline login
 */
export async function offlineLogin(email: string, password: string): Promise<{ user?: OfflineUser; error?: string }> {
  const users = getOfflineUsers();
  const hashedPassword = simpleHash(password);
  
  const user = users.find(u => u.email === email && u.password === hashedPassword);
  
  if (!user) {
    return { error: 'Invalid email or password' };
  }
  
  createOfflineSession(user);
  return { user };
}

/**
 * Offline signup
 */
export async function offlineSignup(
  email: string, 
  password: string, 
  username?: string, 
  role: Role = ROLES.CLIENT
): Promise<{ user?: OfflineUser; error?: string }> {
  const users = getOfflineUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return { error: 'User already exists' };
  }
  
  const newUser: OfflineUser = {
    id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username: username || email.split('@')[0],
    email,
    password: simpleHash(password),
    role,
    avatarUrl: undefined,
    associatedItemIds: []
  };
  
  users.push(newUser);
  setOfflineUsers(users);
  
  createOfflineSession(newUser);
  return { user: newUser };
}

/**
 * Create demo users for offline mode
 */
export function createDemoUsers(): void {
  const demoUsers: OfflineUser[] = [
    {
      id: 'demo_admin',
      username: 'admin',
      email: 'admin@demo.com',
      password: simpleHash('admin123'),
      role: ROLES.ADMIN,
      avatarUrl: undefined,
      associatedItemIds: []
    },
    {
      id: 'demo_manager',
      username: 'manager',
      email: 'manager@demo.com',
      password: simpleHash('manager123'),
      role: ROLES.MANAGER,
      avatarUrl: undefined,
      associatedItemIds: []
    },
    {
      id: 'demo_driver',
      username: 'driver',
      email: 'driver@demo.com',
      password: simpleHash('driver123'),
      role: ROLES.DRIVER,
      avatarUrl: undefined,
      associatedItemIds: []
    },
    {
      id: 'demo_client',
      username: 'client',
      email: 'client@demo.com',
      password: simpleHash('client123'),
      role: ROLES.CLIENT,
      avatarUrl: undefined,
      associatedItemIds: []
    }
  ];
  
  setOfflineUsers(demoUsers);
  console.log('Demo users created for offline mode:', demoUsers.map(u => ({ email: u.email, role: u.role })));
}

/**
 * Check if offline mode is available
 */
export function isOfflineModeAvailable(): boolean {
  try {
    // Test localStorage availability
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (error) {
    return false;
  }
}