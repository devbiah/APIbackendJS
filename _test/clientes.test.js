const request = require('supertest');
const app = require('../index');

describe('Clientes API', () => {
    let clienteId;

    beforeAll(async () => {
        const cliente = { nome: 'Maria', email: 'maria@example.com', senha: 'senha123' };
        const res = await request(app).post('/clientes').send(cliente);
        clienteId = res.body.id;
    });

    it('Deve listar todos os clientes', async () => {
        const res = await request(app).get('/clientes');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Deve listar um cliente pelo ID', async () => {
        const res = await request(app).get(`/clientes/${clienteId}`);
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe('Maria');
    });

    it('Deve criar um cliente com sucesso', async () => {
        const cliente = { nome: 'João', email: 'joao@example.com', senha: 'senha456' };
        const res = await request(app).post('/clientes').send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe('João');
    });

    it('Não deve criar um cliente sem nome', async () => {
        const res = await request(app).post('/clientes').send({ email: 'semnome@example.com', senha: 'senha789' });
        expect(res.status).toBe(400); 
        expect(res.body.error).toBe('Nome, email e senha devem ser informados');
    });

    it('Deve atualizar um cliente pelo ID', async () => {
        const clienteAtualizacao = { nome: 'Ana Atualizada' };
        const res = await request(app).post(`/clientes/${clienteId}`).send(clienteAtualizacao);
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe('Ana Atualizada');
    });

    it('Não deve atualizar um cliente que não existe', async () => {
        const res = await request(app).post('/clientes/${clienteId}').send({ nome: 'Cliente Inexistente' });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Cliente não encontrado');
    });

    it('Deve deletar um cliente pelo ID', async () => {
        const cliente = { nome: 'Pedro', email: 'pedro@example.com', senha: 'senha111' };
        const res = await request(app).post('/clientes').send(cliente);
        const id = res.body.id;

        const deleteRes = await request(app).delete(`/clientes/${id}`);
        expect(deleteRes.status).toBe(204);
    });

    it('Não deve deletar um cliente que não existe', async () => {
        const res = await request(app).delete('/clientes/12345');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Cliente não encontrado');
    });
});
