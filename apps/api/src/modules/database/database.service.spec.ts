import { ConfigService } from '@nestjs/config';
import type { DatabaseConnection } from '@gestor-finanzas/models';
import { describe, expect, it, vi } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { DatabaseService } from './database.service.js';

describe('DatabaseService', () => {
  it('closes its PostgreSQL client during application shutdown', async () => {
    const config = new ConfigService<Environment, true>({
      DATABASE_URL: 'postgres://user:password@127.0.0.1:5432/database',
    });
    const service = new DatabaseService(config);
    const close = vi.fn().mockResolvedValue(undefined);
    (
      service as unknown as { connection: DatabaseConnection }
    ).connection.close = close;

    await service.onApplicationShutdown();

    expect(close).toHaveBeenCalledOnce();
  });
});
