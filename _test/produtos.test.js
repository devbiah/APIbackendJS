const request = require('supertest');
const app = require('../index');

describe('Produtos API', () => {
  let produtoId;

  beforeAll(async () => {
    const produto = { nome: 'Produto Teste', preco: 10.99 };
    const res = await request(app).post('/produtos').send(produto);
    produtoId = res.body.id;
    console.log(produtoId)
  });

  it('Deve listar todos os produtos', async () => {
    const res = await request(app).get('/produtos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Deve listar um produto pelo ID', async () => {
    const res = await request(app).get(`/produtos/${produtoId}`);
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Produto Teste');
  });

  it('Deve criar um produto com sucesso', async () => {
    const produto = { nome: 'Produto Novo', preco: 15.99 };
    const res = await request(app).post('/produtos').send(produto);
    expect(res.status).toBe(201);
    expect(res.body.nome).toBe('Produto Novo');
  });

  it('Não deve criar um produto sem nome', async () => {
    const res = await request(app).post('/produtos').send({ preco: 25.99 });
    expect(res.status).toBe(400); 
    expect(res.body.error).toBe('Nome e preço devem ser informados');
  });

  it('Não deve criar um produto sem preço', async () => {
    const res = await request(app).post('/produtos').send({ nome: 'Produto Sem Preço' });
    expect(res.status).toBe(400); 
    expect(res.body.error).toBe('Nome e preço devem ser informados');
  });

  it('Deve atualizar um produto pelo ID', async () => {
    const produtoAtualizacao = { nome: 'Produto Atualizado', preco: 12.99 };
    const res = await request(app).post(`/produtos/${produtoId}`).send(produtoAtualizacao);
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Produto Atualizado');
  });

  it('Não deve atualizar um produto que não existe', async () => {
    const res = await request(app).post('/produtos/${produtoId}').send({ nome: 'Produto Inexistente' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Produto não encontrado');
  });

  it('Deve deletar um produto pelo ID', async () => {
    const produto = { nome: 'Produto Deletar', preco: 22.99 };
    const res = await request(app).post('/produtos').send(produto);
    const id = res.body.id;
    
    const deleteRes = await request(app).delete(`/produtos/${id}`);
    expect(deleteRes.status).toBe(204);
  });

  it('Não deve deletar um produto que não existe', async () => {
    const res = await request(app).delete('/produtos/12345');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Produto não encontrado');
  });
});
