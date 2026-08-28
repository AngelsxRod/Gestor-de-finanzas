import { Test, type TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = module.get(HealthController);
  });

  it('returns the public health contract', () => {
    expect(healthController.getHealth()).toEqual({
      status: 'ok',
      service: 'gestor-finanzas-api',
    });
  });
});
