import { BaseRepository, DatabaseConnection } from '../database/connection.js';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository extends BaseRepository<User> {
  constructor(db: DatabaseConnection) {
    super(db, 'users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.db.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return results[0] || null;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Set default permissions based on roles
    const permissions = this.getPermissionsForRoles(userData.roles || ['user']);
    
    const user = {
      id: uuidv4(),
      email: userData.email.toLowerCase(),
      password_hash: hashedPassword,
      first_name: userData.first_name,
      last_name: userData.last_name,
      roles: userData.roles || ['user'],
      permissions,
      is_active: true,
      email_verified: false,
      last_login: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    return await this.create(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password_hash);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  async findActiveUsers(limit: number = 100, offset: number = 0): Promise<User[]> {
    return await this.db.query<User>(
      'SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
  }

  async searchUsers(query: string, limit: number = 50): Promise<User[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    return await this.db.query<User>(
      `SELECT * FROM users 
       WHERE (LOWER(email) LIKE $1 OR LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1)
       AND is_active = true
       ORDER BY created_at DESC
       LIMIT $2`,
      [searchPattern, limit]
    );
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await this.db.query<User>(
      'SELECT * FROM users WHERE $1 = ANY(roles) AND is_active = true',
      [role]
    );
  }

  async updateUserRoles(userId: string, roles: string[]): Promise<User | null> {
    const permissions = this.getPermissionsForRoles(roles);
    
    const results = await this.db.query<User>(
      'UPDATE users SET roles = $2, permissions = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [userId, roles, permissions]
    );
    
    return results[0] || null;
  }

  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const results = await this.db.query(
      'UPDATE users SET password_hash = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId, hashedPassword]
    );
    
    return (results as any).rowCount > 0;
  }

  async verifyEmail(userId: string): Promise<boolean> {
    const results = await this.db.query(
      'UPDATE users SET email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
    
    return (results as any).rowCount > 0;
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    roleDistribution: Record<string, number>;
  }> {
    const [totalUsers, activeUsers, verifiedUsers] = await Promise.all([
      this.count(),
      this.count('is_active = true'),
      this.count('email_verified = true')
    ]);

    // Get role distribution
    const roleResults = await this.db.query<{ role: string; count: string }>(
      `SELECT unnest(roles) as role, COUNT(*) as count 
       FROM users WHERE is_active = true 
       GROUP BY role
       ORDER BY count DESC`
    );

    const roleDistribution: Record<string, number> = {};
    roleResults.forEach(row => {
      roleDistribution[row.role] = parseInt(row.count);
    });

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      roleDistribution
    };
  }

  private getPermissionsForRoles(roles: string[]): string[] {
    const rolePermissions: Record<string, string[]> = {
      'admin': ['read', 'write', 'delete', 'manage_users', 'manage_system', 'view_analytics'],
      'manager': ['read', 'write', 'manage_team', 'view_reports', 'manage_orders'],
      'driver': ['read', 'update_location', 'update_status', 'scan_items'],
      'dispatcher': ['read', 'write', 'assign_routes', 'track_vehicles'],
      'customer': ['read', 'track_orders', 'create_orders'],
      'user': ['read', 'update_profile']
    };

    const allPermissions = new Set<string>();
    roles.forEach(role => {
      const permissions = rolePermissions[role] || ['read'];
      permissions.forEach(permission => allPermissions.add(permission));
    });

    return Array.from(allPermissions);
  }
}