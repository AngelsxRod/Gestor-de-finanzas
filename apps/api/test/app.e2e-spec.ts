import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { accounts, categories } from '@gestor-finanzas/models';
import request from 'supertest';
import { configureApp } from './../src/app.config.js';
import { AppModule } from './../src/app.module.js';
import { DatabaseService } from './../src/modules/database/database.service.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error('E2E tests require an isolated *_test database');
}

describe('application (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    database = moduleFixture.get(DatabaseService);
    await database.db.delete(categories);
    await database.db.delete(accounts);
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect({ status: 'ok', service: 'gestor-finanzas-api' });
  });

  it('/api/v1/accounts (GET) returns an empty account collection', () => {
    return request(app.getHttpServer())
      .get('/api/v1/accounts')
      .expect(200)
      .expect({ accounts: [] });
  });

  it('/api/v1/accounts (POST) validates, creates and exposes the account', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/accounts')
      .send({
        name: '   ',
        type: 'wallet',
        currency: 'GT',
        openingBalance: '1.23456',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          code: 'VALIDATION_ERROR',
          message: 'La solicitud contiene datos inválidos.',
        });
        expect(body.details).toHaveLength(4);
      });

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/accounts')
      .send({
        name: '  Cuenta principal  ',
        type: 'checking',
        currency: 'gtq',
        openingBalance: '001250.5',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      account: {
        name: 'Cuenta principal',
        type: 'checking',
        currency: 'GTQ',
        openingBalance: '1250.5000',
        isActive: true,
      },
    });
    expect(createResponse.body.account.id).toEqual(expect.any(String));
    expect(createResponse.body.account.createdAt).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .post('/api/v1/accounts')
      .send({
        name: 'cuenta principal',
        type: 'cash',
        currency: 'USD',
        openingBalance: '0',
      })
      .expect(409)
      .expect({
        code: 'ACCOUNT_NAME_CONFLICT',
        message: 'Ya existe una cuenta con ese nombre.',
      });

    const listResponse = await request(app.getHttpServer())
      .get('/api/v1/accounts')
      .expect(200);

    expect(listResponse.body).toEqual({
      accounts: [createResponse.body.account],
    });
  });

  it('/api/v1/categories (GET) returns an empty category collection', () => {
    return request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200)
      .expect({ categories: [] });
  });

  it('/api/v1/categories validates, creates, scopes duplicates and orders the list', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({ name: '   ', type: 'transfer' })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          code: 'VALIDATION_ERROR',
          message: 'La solicitud contiene datos inválidos.',
        });
        expect(body.details).toHaveLength(2);
      });

    const expense = await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({ name: '  Vivienda  ', type: 'expense' })
      .expect(201);
    expect(expense.body).toMatchObject({
      category: { name: 'Vivienda', type: 'expense' },
    });

    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({ name: 'vIVIENDA', type: 'expense' })
      .expect(409)
      .expect({
        code: 'CATEGORY_NAME_CONFLICT',
        message: 'Ya existe una categoría con ese nombre y tipo.',
      });

    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({ name: 'vivienda', type: 'income' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({ name: 'Alimentación', type: 'expense' })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);
    expect(
      list.body.categories.map(
        (category: { type: string; name: string }) =>
          `${category.type}:${category.name}`,
      ),
    ).toEqual(['income:vivienda', 'expense:Alimentación', 'expense:Vivienda']);
  });

  afterEach(async () => {
    await database.db.delete(categories);
    await database.db.delete(accounts);
    await app.close();
  });
});
