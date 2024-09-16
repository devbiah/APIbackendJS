const jwt = require('jsonwebtoken')

function validadorDeCookie(req, res, next) {
    const token = req.cookie.TokenAulaBE
    if (!token) {
        return res.status(401).send({ mesagem: 'não autorizado.' })
    }
    try {
        const decodificado = jwt.verify(token, process.env.chave_criptografia)
        next();
    } catch {
        return res.status(401).send({ mesagem: 'não autorizado.' })
    }
}
module.exports = { validadorDeCookie }