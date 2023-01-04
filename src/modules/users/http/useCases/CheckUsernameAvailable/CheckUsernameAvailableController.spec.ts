import request from 'supertest';
import { app } from '@shared/http/app';

describe('Check Username Availability Controller', () => {
  it('should be able to check email availability', async () => {
    const response = await request(app)
      .post('/sessions/valid_username')
      .send({ username: 'someusername' });

    expect(response.status).toBe(204);
  });
});
