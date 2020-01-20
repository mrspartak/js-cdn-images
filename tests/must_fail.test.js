const request = require('supertest')
const app = require('../src/server')

describe('GET /ping', () => {
	it('should get PONG', async (done) => {

		let res = await request(app)
			.get('/ping')

		expect(res.status).toEqual(200)
		expect(res.text).toEqual('PONG')

		done();
	})
})