const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const rotasProdutos = require('./rotas_produto')
const rotasClientes = require('./rotas_clientes')


app.use(bodyParser.json())

app.use('/produtos', rotasProdutos)
app.use('/clientes', rotasClientes)

// app.listen(8000)

module.exports = app