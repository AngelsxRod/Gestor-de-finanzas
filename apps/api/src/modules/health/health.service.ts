import { Injectable } from '@nestjs/common';
import {
  healthResponseSchema,
  type HealthResponse,
} from '@gestor-finanzas/contracts';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({
      status: 'ok',
      service: 'gestor-finanzas-api',
    });
  }
}
