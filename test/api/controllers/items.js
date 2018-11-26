const should = require('should');
const request = require('supertest');
const server = require('../../../app');

describe('controllers', () => {
    describe('items', () => {
        describe('GET /items', () => {
            it('should return all items as array', (done) => {
                request(server)
                    .get('/items')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((error, response) => {
                        should.not.exist(error);
                        response.body.should.be.an.Array();
                        done();
                    });
            });
        });

        describe('GET /items/:id', () => {
            it('should return the item for a given id', (done) => {
                const expectedItem = {
                    id: '9780201485677',
                    title: 'Refactoring: Improving the Design of Existing Code',
                    user: 'Martin Fowler'
                };
                request(server)
                    .get(`/items/${expectedItem.id}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((error, response) => {
                        should.not.exist(error);
                        response.body.id.should.be.equal(expectedItem.id);
                        response.body.title.should.be.equal(expectedItem.title);
                        response.body.user.should.be.equal(expectedItem.user);
                        done();
                    });
            });

            /* TODO Hier weitere Tests */
        });
    });
});