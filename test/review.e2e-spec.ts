import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import { disconnect } from 'mongoose';
import { ERROR_MESSAGES } from '../src/constants/messages';
import { loginDto } from './auth.e2e-spec';

const productId = new Types.ObjectId().toHexString();
const fakeId = new Types.ObjectId().toHexString();

const testReviewDto: CreateReviewDto = {
  name: 'TestReview',
  title: 'TestReviewTitle',
  description: 'Hello TestReview',
  rating: 3,
  productId
}

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdReviewId: string;
  let loginToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    loginToken = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testReviewDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdReviewId = body._id;
        expect(createdReviewId).toBeDefined()
      })
  });

  it('/review/create (POST) - fail rating', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testReviewDto, rating: 0 })
      .expect(400)
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect((body.length)).toBe(1);
      })
  });

  it('/review/byProduct/:productId (GET) - fail', async () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${fakeId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect((body.length)).toBe(0);
      })
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdReviewId}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(200)
  });

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete(`/review/${fakeId}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(404, {
        statusCode: 404,
        message: ERROR_MESSAGES.REVIEW_NOT_FOUND
      })
  });

  afterAll(() => {
    disconnect();
  });
});
