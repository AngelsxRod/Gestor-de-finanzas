import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment.js';
import { AccountsModule } from './modules/accounts/accounts.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BudgetsModule } from './modules/budgets/budgets.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { DatabaseModule } from './modules/database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env', '../../.env'],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    AccountsModule,
    AuthModule,
    BudgetsModule,
    CategoriesModule,
    DatabaseModule,
    HealthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
