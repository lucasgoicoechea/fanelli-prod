const path = require('path')
const async = require('asyncawait/async')
const jwt = require('jsonwebtoken')
const config = require(path.join(__dirname, '/../config'))
const Boom = require('boom')
const unless = require('express-unless')

let reloadToken = async(function (req, res, next) {
    const tokenReq = null
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        tokenReq = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        tokenReq = req.query.token;
    } 
    // decode token
    if (tokenReq !== null) {
        /*jwt.verify(tokenReq, config.secret, function(err, decoded) {
            if (err) {
                next(Boom.unauthorized('Token invalido o mal formado'))
            }
            req.decoded = decoded;
        });
        winston.log('debug', 'New refresh login from', {user: req.decoded.user.name})
        let user = req.decoded.user
        let token = jwt.sign({
            user_type: user.user_type,
            id: user._id,
            name: user.name,
            lastname: user.lastname,
            picture: user.picture
        }, config.jwtSecret,{ expiresIn: '5m', })
        let userResponse = {
            _id: user._id,
            dni: user.dni,
            legajo: user.legajo,
            name: user.name,
            lastname: user.lastname,
            sector: user.sector,
            shift: user.shift,
            lgoico: 24,
            incorporation_date: user.incorporation_date,
            birthdate: user.birthdate,
            position: user.position,
            picture: user.picture,
            user_type: user.user_type
        }
        res.setHeader('authorization',{success: true, user: userResponse, token: token})
        res.setHeader('authorization','PRUEBA LUCAS')*/
        //next()        
    }
    else {
            next(Boom.unauthorized('Token invalido o mal formado'))
    }
})

reloadToken.unless = unless

module.exports = {
    reloadToken: reloadToken
}