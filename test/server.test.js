const request = require('supertest');
const { expect } = require('chai');
const app = require('../app/server');

describe('Hello World App', () => {
  it('GET / should return 200 and greeting text', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('Hello World');
  });

  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('ok');
  });
});
