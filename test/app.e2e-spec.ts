import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('GET /locations/traffic', () => {
    it('should respond with 200', () => {
      return request(app.getHttpServer())
        .get('/locations/traffic?datetime=2024-01-01')
        .expect(200);
    });

    it('should respond with 400 if no datetime provided', () => {
      return request(app.getHttpServer()).get('/locations/traffic').expect(400);
    });
  });

  describe('GET /locations/weather', () => {
    it('should respond with 400 if no datetime provided', () => {
      return request(app.getHttpServer()).get('/locations/weather').expect(400);
    });

    it('should respond with 400 if no latitude provided', () => {
      return request(app.getHttpServer())
        .get(
          '/locations/weather?datetime=2024-01-01&latitude=1.02&location=Loc',
        )
        .expect(400);
    });

    it('should respond with 400 if no longitude provided', () => {
      return request(app.getHttpServer())
        .get(
          '/locations/weather?datetime=2024-01-01&latitude=1.02&location=Loc',
        )
        .expect(400);
    });

    it('should respond with 400 if no location provided', () => {
      return request(app.getHttpServer())
        .get(
          '/locations/weather?datetime=2024-01-01&latitude=1.02&longitude=1.02',
        )
        .expect(400);
    });
  });

  describe('GET /reports/top-searches', () => {
    it('should respond with 400 if no start_datetime provided', () => {
      return request(app.getHttpServer())
        .get('/reports/top-searches?end_datetime=2024-01-01')
        .expect(400);
    });

    it('should respond with 400 if no end_datetime provided', () => {
      return request(app.getHttpServer())
        .get('/reports/top-searches?start_datetime=2024-01-01')
        .expect(400);
    });
  });

  describe('GET /reports/most-searches-period', () => {
    it('should respond with 400 if no start_datetime provided', () => {
      return request(app.getHttpServer())
        .get('/reports/most-searches-period?end_datetime=2024-01-01')
        .expect(400);
    });

    it('should respond with 400 if no end_datetime provided', () => {
      return request(app.getHttpServer())
        .get('/reports/most-searches-period?start_datetime=2024-01-01')
        .expect(400);
    });
  });
});
