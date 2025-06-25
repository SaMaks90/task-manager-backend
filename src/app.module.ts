import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
// import { UsersModule } from './users/users.module';
// import { AuthController } from './auth/auth.controller';
// import { AuthService } from './auth/auth.service';
// import { AuthModule } from './auth/auth.module';
// import { TasksController } from './tasks/tasks.controller';
// import { TasksService } from './tasks/tasks.service';
// import { TasksModule } from './tasks/tasks.module';
// import { UsersController } from './src/users/users.controller';
// import { UsersController } from './users/users.controller';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
