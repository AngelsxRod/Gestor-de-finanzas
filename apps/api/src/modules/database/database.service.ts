import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createDatabase,
  type Database,
  type DatabaseConnection,
} from '@gestor-finanzas/models';
import type { Environment } from '../../config/environment.js';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly db: Database;
  private readonly connection: DatabaseConnection;

  constructor(config: ConfigService<Environment, true>) {
    this.connection = createDatabase(config.getOrThrow('DATABASE_URL'));
    this.db = this.connection.db;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.connection.close();
  }
}
