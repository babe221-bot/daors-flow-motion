import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller.js';
import { UserService } from './services/user.service.js';
import { PreferencesController } from './controllers/preferences.controller.js';
import { NavigationController } from './controllers/navigation.controller.js';
import { PreferencesService } from './services/preferences.service.js';
import { NavigationService } from './services/navigation.service.js';

@Module({
  controllers: [
    UsersController,
    PreferencesController,
    NavigationController
  ],
  providers: [
    UserService,
    PreferencesService,
    NavigationService
  ]
})
export class AppModule {}