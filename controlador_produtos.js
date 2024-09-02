const db = require('./db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const listProdutos = async (req, res) => {
    res.json(db.produtos);
};

const getProduto = async (req, res) => {
    const _id = req.params.id;
    const produto = db.produtos.find(produto => produto.id === _id);
    
    if (produto) {
        res.json(produto);
    } else {
        res.status(404).send({ error: 'Produto não encontrado' });
    }
};

const createProduto = async (req, res) => {
    const dados = req.body;

    if (!dados.nome || !dados.preco) {
        return res.status(400).send({ error: 'Nome e preço devem ser informados' });
    }

    const _id = uuidv4();
    dados.id = _id;
    db.produtos.push(dados);

    fs.writeFile('./db.json', JSON.stringify(db, null, 2), err => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(201).send(dados); 
    });
};

const updateProduto = async (req, res) => {
    const _id = req.params.id;
    const dados = req.body;
    const index = db.produtos.findIndex(produto => produto.id === _id);

    if (index === -1) {
        return res.status(404).send({ error: 'Produto não encontrado' });
    }

    db.produtos[index] = { ...db.produtos[index], ...dados };

    fs.writeFile('./db.json', JSON.stringify(db, null, 2), err => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(200).send(db.produtos[index]); 
    });
};

const deleteProduto = async (req, res) => {
    const _id = req.params.id;
    const index = db.produtos.findIndex(produto => produto.id === _id);

    if (index === -1) {
        return res.status(404).send({ error: 'Produto não encontrado' });
    }

    db.produtos.splice(index, 1);

    fs.writeFile('./db.json', JSON.stringify(db, null, 2), err => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(204).send(); // No Content
    });
};

module.exports = { listProdutos, getProduto, createProduto, updateProduto, deleteProduto };
