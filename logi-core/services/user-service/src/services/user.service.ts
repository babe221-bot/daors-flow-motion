import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.js';
import { DatabaseConnection } from '../database/connection.js';
import { User, CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/user.model.js';

@Injectable()
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    const db = new DatabaseConnection();
    this.userRepository = new UserRepository(db);
  }

  async findById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.sanitizeUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll(limit, offset);
    return users.map(user => this.sanitizeUser(user));
  }

  async findActiveUsers(limit: number = 50, offset: number = 0): Promise<UserResponse[]> {
    const users = await this.userRepository.findActiveUsers(limit, offset);
    return users.map(user => this.sanitizeUser(user));
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    // Validate email format
    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await this.userRepository.createUser(userData);
    return this.sanitizeUser(user);
  }

  async updateUser(id: string, updateData: UpdateUserRequest): Promise<UserResponse | null> {
    const user = await this.userRepository.update(id, updateData as Partial<User>);
    return user ? this.sanitizeUser(user) : null;
  }

  async updateUserRoles(id: string, roles: string[]): Promise<UserResponse | null> {
    const validRoles = ['admin', 'manager', 'driver', 'dispatcher', 'customer', 'user'];
    const invalidRoles = roles.filter(role => !validRoles.includes(role));
    
    if (invalidRoles.length > 0) {
      throw new Error(`Invalid roles: ${invalidRoles.join(', ')}`);
    }

    const user = await this.userRepository.updateUserRoles(id, roles);
    return user ? this.sanitizeUser(user) : null;
  }

  async changePassword(id: string, newPassword: string): Promise<boolean> {
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    return await this.userRepository.changePassword(id, newPassword);
  }

  async validateUser(email: string, password: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    const isValidPassword = await this.userRepository.validatePassword(user, password);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    return this.sanitizeUser(user);
  }

  async searchUsers(query: string, limit: number = 50): Promise<UserResponse[]> {
    const users = await this.userRepository.searchUsers(query, limit);
    return users.map(user => this.sanitizeUser(user));
  }

  async getUsersByRole(role: string): Promise<UserResponse[]> {
    const users = await this.userRepository.getUsersByRole(role);
    return users.map(user => this.sanitizeUser(user));
  }

  async verifyEmail(id: string): Promise<boolean> {
    return await this.userRepository.verifyEmail(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    // In production, you might want to soft-delete or archive instead
    return await this.userRepository.delete(id);
  }

  async getUserCount(activeOnly: boolean = false): Promise<number> {
    return activeOnly 
      ? await this.userRepository.count('is_active = true')
      : await this.userRepository.count();
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    roleDistribution: Record<string, number>;
  }> {
    return await this.userRepository.getUserStats();
  }

  async getHealthStatus(): Promise<any> {
    return this.userRepository['db'].getHealthStatus();
  }

  private sanitizeUser(user: User): UserResponse {
    // Remove sensitive information from user object
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser as UserResponse;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}