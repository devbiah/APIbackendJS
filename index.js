require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const rotasProdutos = require('./routes/rotas_produto')
const rotasClientes = require('./routes/rotas_clientes')
const rotasAutenticacao = require('./routes/rotas_autenticacao')
const cookieParser = require('cookie-parser')


app.use(bodyParser.json())
app.use(cookieParser())

app.use('/produtos', rotasProdutos)
app.use('/clientes', rotasClientes)
app.use('/auth', rotasAutenticacao)

// app.listen(8000)

module.exports = app