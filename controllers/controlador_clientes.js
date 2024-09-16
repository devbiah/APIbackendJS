const db = require('../db.json');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs');
const fs = require('fs');


const listClientes = async (req, res) => {
    console.log(req.cookies)
    try {
        const clientes = db.clientes;
        res.status(200).json(clientes);
    } catch (err) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
};


const getCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = db.clientes.find(cliente => cliente.id === id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).send({ error: 'Cliente não encontrado' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
};

const createCliente = async (req, res) => {
    const dados = req.body;

    if (!dados.nome || !dados.email || !dados.senha) {
        return res.status(400).send({ error: 'Nome, email e senha devem ser informados' });
    }

    try {
        const id = uuidv4();
        const senhaHash = bcryptjs.hashSync(dados.senha, 10);
        const novoCliente = { ...dados, id, senha: senhaHash };

        db.clientes.push(novoCliente);

        fs.writeFile('./db.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ error: 'Erro ao salvar no servidor' });
            }
            res.status(201).json(novoCliente); 
        });
    } catch (err) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
};
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    try {
        const clienteIndex = db.clientes.findIndex(cliente => cliente.id === id);

        if (clienteIndex === -1) {
            return res.status(404).send({ error: 'Cliente não encontrado' });
        }

        if (dados.senha) {
            dados.senha = bcryptjs.hashSync(dados.senha, 10);
        }

        db.clientes[clienteIndex] = { ...db.clientes[clienteIndex], ...dados };

        fs.writeFile('./db.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ error: 'Erro ao salvar no servidor' });
            }
            res.status(200).json(db.clientes[clienteIndex]);
        });
    } catch (err) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
};


const deleteCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const clienteIndex = db.clientes.findIndex(cliente => cliente.id === id);

        if (clienteIndex === -1) {
            return res.status(404).send({ error: 'Cliente não encontrado' });
        }

        db.clientes.splice(clienteIndex, 1);

        fs.writeFile('./db.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ error: 'Erro ao salvar no servidor' });
            }
            res.status(204).send();
        });
    } catch (err) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
};

module.exports = { listClientes, getCliente, createCliente, updateCliente, deleteCliente };
