import { describe, expect, it } from 'vitest';
import { healthResponseSchema } from './health.js';

describe('healthResponseSchema', () => {
  it('accepts the public health response', () => {
    expect(
      healthResponseSchema.parse({
        status: 'ok',
        service: 'gestor-finanzas-api',
      }),
    ).toEqual({ status: 'ok', service: 'gestor-finanzas-api' });
  });

  it('rejects responses outside the contract', () => {
    expect(() =>
      healthResponseSchema.parse({ status: 'down', service: 'api' }),
    ).toThrow();
  });
});
