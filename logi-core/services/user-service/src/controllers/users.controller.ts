import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../services/user.service.js';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/user.model.js';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: any;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('health')
  async health(): Promise<ApiResponse> {
    const dbHealth = await this.userService.getHealthStatus();
    return {
      success: true,
      data: {
        status: 'ok',
        database: dbHealth,
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('stats')
  async getStats(@Headers('x-user-roles') userRoles?: string): Promise<ApiResponse> {
    this.requireRole(['admin', 'manager'], userRoles);
    
    const stats = await this.userService.getUserStats();
    return {
      success: true,
      data: stats
    };
  }

  @Get('search')
  async searchUsers(
    @Query('q') query: string,
    @Query('limit') limit?: number,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse[]>> {
    this.requireRole(['admin', 'manager', 'dispatcher'], userRoles);
    
    if (!query || query.length < 2) {
      throw new HttpException('Search query must be at least 2 characters', HttpStatus.BAD_REQUEST);
    }

    const users = await this.userService.searchUsers(query, limit ? parseInt(limit.toString()) : 50);
    return {
      success: true,
      data: users,
      meta: { count: users.length }
    };
  }

  @Get('role/:role')
  async getUsersByRole(
    @Param('role') role: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse[]>> {
    this.requireRole(['admin', 'manager'], userRoles);
    
    const users = await this.userService.getUsersByRole(role);
    return {
      success: true,
      data: users,
      meta: { role, count: users.length }
    };
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @Headers('x-user-id') requesterId?: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse>> {
    // Users can access their own profile, or admin/manager can access any
    if (id !== requesterId) {
      this.requireRole(['admin', 'manager'], userRoles);
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      data: user
    };
  }

  @Get()
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('active') activeOnly?: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse[]>> {
    this.requireRole(['admin', 'manager'], userRoles);

    const pageNum = page ? parseInt(page.toString()) : 1;
    const limitNum = limit ? parseInt(limit.toString()) : 50;
    const offset = (pageNum - 1) * limitNum;
    const isActiveOnly = activeOnly === 'true';

    const [users, totalCount] = await Promise.all([
      isActiveOnly 
        ? this.userService.findActiveUsers(limitNum, offset)
        : this.userService.findAll(limitNum, offset),
      this.userService.getUserCount(isActiveOnly)
    ]);

    return {
      success: true,
      data: users,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum)
      }
    };
  }

  @Post()
  async createUser(
    @Body() userData: CreateUserRequest,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse>> {
    this.requireRole(['admin', 'manager'], userRoles);
    
    // Validate input
    if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }

    if (userData.password.length < 8) {
      throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.userService.createUser(userData);
      return {
        success: true,
        data: user,
        message: 'User created successfully'
      };
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserRequest,
    @Headers('x-user-id') requesterId?: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse>> {
    // Users can update their own profile (limited fields), admin/manager can update any
    const canUpdateAny = this.hasRole(['admin', 'manager'], userRoles);
    const isOwnProfile = id === requesterId;

    if (!canUpdateAny && !isOwnProfile) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // Restrict what non-admin users can update
    if (isOwnProfile && !canUpdateAny) {
      const allowedFields = ['first_name', 'last_name'];
      const requestedFields = Object.keys(updateData);
      const invalidFields = requestedFields.filter(field => !allowedFields.includes(field));
      
      if (invalidFields.length > 0) {
        throw new HttpException(`Cannot update fields: ${invalidFields.join(', ')}`, HttpStatus.FORBIDDEN);
      }
    }

    try {
      const user = await this.userService.updateUser(id, updateData);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: user,
        message: 'User updated successfully'
      };
    } catch (error) {
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/roles')
  async updateUserRoles(
    @Param('id') id: string,
    @Body() { roles }: { roles: string[] },
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse<UserResponse>> {
    this.requireRole(['admin'], userRoles);

    if (!Array.isArray(roles) || roles.length === 0) {
      throw new HttpException('Invalid roles array', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.updateUserRoles(id, roles);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      data: user,
      message: 'User roles updated successfully'
    };
  }

  @Put(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() { newPassword }: { newPassword: string },
    @Headers('x-user-id') requesterId?: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse> {
    const canUpdateAny = this.hasRole(['admin'], userRoles);
    const isOwnProfile = id === requesterId;

    if (!canUpdateAny && !isOwnProfile) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (!newPassword || newPassword.length < 8) {
      throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST);
    }

    const success = await this.userService.changePassword(id, newPassword);
    if (!success) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  @Put(':id/verify')
  async verifyEmail(
    @Param('id') id: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse> {
    this.requireRole(['admin', 'system'], userRoles);

    const success = await this.userService.verifyEmail(id);
    if (!success) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Email verified successfully'
    };
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Headers('x-user-roles') userRoles?: string
  ): Promise<ApiResponse> {
    this.requireRole(['admin'], userRoles);

    const success = await this.userService.deleteUser(id);
    if (!success) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  private requireRole(requiredRoles: string[], userRoles?: string): void {
    if (!userRoles) {
      throw new HttpException('Authentication required', HttpStatus.UNAUTHORIZED);
    }

    const roles = userRoles.split(',').map(r => r.trim());
    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));

    if (!hasRequiredRole) {
      throw new HttpException(`Requires one of: ${requiredRoles.join(', ')}`, HttpStatus.FORBIDDEN);
    }
  }

  private hasRole(roles: string[], userRoles?: string): boolean {
    if (!userRoles) return false;
    
    const userRoleList = userRoles.split(',').map(r => r.trim());
    return roles.some(role => userRoleList.includes(role));
  }
}