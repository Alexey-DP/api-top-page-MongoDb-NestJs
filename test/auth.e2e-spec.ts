import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { UserDto } from '../src/auth/dto/user-create.dto';
import { ERROR_MESSAGES } from '../src/constants/messages';

export const loginDto: UserDto = {
    login: 'user@mail.test',
    password: '123456789'
}

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.access_token).toBeDefined()
            })
    });

    it('/auth/login (POST) - fail email', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, login: 'fakeUser@mail.test' })
            .expect(400, {
                statusCode: 400,
                message: ERROR_MESSAGES.USER_WRONG,
                error: 'Bad Request'
            })

    });

    it('/auth/login (POST) - fail email', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, password: '987654321' })
            .expect(400, {
                statusCode: 400,
                message: ERROR_MESSAGES.USER_WRONG,
                error: 'Bad Request'
            })

    });

    afterAll(() => {
        disconnect();
    });
});
