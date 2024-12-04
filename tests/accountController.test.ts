import request from 'supertest';
import express from 'express';
import accountRoutes from '../src/routes/accountRoutes';

const app = express();
app.use(express.json());
app.use('/accounts', accountRoutes);

describe('Account Controller', () => {

    //Common tests

    it('should create an account', async () => {
        const response = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.balance).toBe(100);
    });

    it('should get account details', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId = createResponse.body.id;

        const response = await request(app)
            .get(`/accounts/${accountId}`);
        expect(response.status).toBe(200);
        expect(response.body.account).toHaveProperty('id', accountId);
        expect(response.body.account).toHaveProperty('balance', 100);
        expect(response.body.message).toBe(`You have 100 in your account.`);
    });

    it('should deposit money into an account', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId = createResponse.body.id;

        const response = await request(app)
            .post(`/accounts/${accountId}/deposit`)
            .send({ amount: 50 });
        expect(response.status).toBe(200);
        expect(response.body.balance).toBe(150);
    });

    it('should withdraw money from an account', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId = createResponse.body.id;

        const response = await request(app)
            .post(`/accounts/${accountId}/withdraw`)
            .send({ amount: 30 });
        expect(response.status).toBe(200);
        expect(response.body.balance).toBe(70);
    });

    it('should transfer money between accounts', async () => {
        const createResponse1 = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId1 = createResponse1.body.id;

        const createResponse2 = await request(app)
            .post('/accounts')
            .send({ balance: 50 });
        const accountId2 = createResponse2.body.id;

        const response = await request(app)
            .post('/accounts/transfer')
            .send({ fromId: accountId1, toId: accountId2, amount: 20 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transfer successful');

        const fromAccountResponse = await request(app)
            .get(`/accounts/${accountId1}`);
        expect(fromAccountResponse.body.account.balance).toBe(80);

        const toAccountResponse = await request(app)
            .get(`/accounts/${accountId2}`);
        expect(toAccountResponse.body.account.balance).toBe(70);
    });

    //Concurrency tests

    it('should handle concurrent deposits correctly', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId = createResponse.body.id;

        const depositPromises = [];
        for (let i = 0; i < 10; i++) {
            depositPromises.push(request(app)
                .post(`/accounts/${accountId}/deposit`)
                .send({ amount: 10 }));
        }

        await Promise.all(depositPromises);

        const response = await request(app)
            .get(`/accounts/${accountId}`);
        expect(response.status).toBe(200);
        expect(response.body.account.balance).toBe(200);
    });

    it('should handle concurrent withdrawals correctly', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId = createResponse.body.id;

        const withdrawPromises = [];
        for (let i = 0; i < 10; i++) {
            withdrawPromises.push(request(app)
                .post(`/accounts/${accountId}/withdraw`)
                .send({ amount: 10 }));
        }

        await Promise.all(withdrawPromises);

        const response = await request(app)
            .get(`/accounts/${accountId}`);
        expect(response.status).toBe(200);
        expect(response.body.account.balance).toBe(0);
    });

    it('should handle concurrent transfers correctly', async () => {
        const createResponse1 = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId1 = createResponse1.body.id;

        const createResponse2 = await request(app)
            .post('/accounts')
            .send({ balance: 50 });
        const accountId2 = createResponse2.body.id;

        const transferPromises = [];
        for (let i = 0; i < 10; i++) {
            transferPromises.push(request(app)
                .post('/accounts/transfer')
                .send({ fromId: accountId1, toId: accountId2, amount: 10 }));
        }

        await Promise.all(transferPromises);

        const fromAccountResponse = await request(app)
            .get(`/accounts/${accountId1}`);
        expect(fromAccountResponse.status).toBe(200);
        expect(fromAccountResponse.body.account.balance).toBe(0);

        const toAccountResponse = await request(app)
            .get(`/accounts/${accountId2}`);
        expect(toAccountResponse.status).toBe(200);
        expect(toAccountResponse.body.account.balance).toBe(150);
    });
    
    // Tests for failure scenarios

    it('should fail to withdraw more money than available', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId = createResponse.body.id;

        const response = await request(app)
            .post(`/accounts/${accountId}/withdraw`)
            .send({ amount: 200 });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Insufficient balance');
    });

    it('should fail to transfer more money than available', async () => {
        const createResponse1 = await request(app)
            .post('/accounts')
            .send({ balance: 100 });
        const accountId1 = createResponse1.body.id;

        const createResponse2 = await request(app)
            .post('/accounts')
            .send({ balance: 50 });
        const accountId2 = createResponse2.body.id;

        const response = await request(app)
            .post('/accounts/transfer')
            .send({ fromId: accountId1, toId: accountId2, amount: 200 });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Insufficient balance');
    });

    it('should fail to deposit to a non-existent account', async () => {
        const response = await request(app)
            .post('/accounts/999/deposit')
            .send({ amount: 50 });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Account not found');
    });

    it('should fail to withdraw from a non-existent account', async () => {
        const response = await request(app)
            .post('/accounts/999/withdraw')
            .send({ amount: 50 });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Account not found');
    });

    it('should fail to transfer from a non-existent account', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 50 });
        const accountId = createResponse.body.id;

        const response = await request(app)
            .post('/accounts/transfer')
            .send({ fromId: 999, toId: accountId, amount: 50 });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('One or both accounts not found');
    });

    it('should fail to transfer to a non-existent account', async () => {
        const createResponse = await request(app)
            .post('/accounts')
            .send({ balance: 50 });
        const accountId = createResponse.body.id;

        const response = await request(app)
            .post('/accounts/transfer')
            .send({ fromId: accountId, toId: 999, amount: 50 });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('One or both accounts not found');
    });
});