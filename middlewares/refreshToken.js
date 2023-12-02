const path = require('path')
const userModel = require(path.join(__dirname, '/../model')).user
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const jwt = require('jsonwebtoken')
const config = require(path.join(__dirname, '/../config'))
const Boom = require('boom')
const unless = require('express-unless')
const winston = require('winston')
const ObjectId = require('mongoose').Types.ObjectId

let reloadToken = async(function (req, res, next) {
    let tokenReq = null
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
        });*/
        //let user = req.user
        var decodede = jwt.decode(tokenReq, config.secret)
        console.log(decodede);
        if (decodede.id == null)
        {
            next(Boom.unauthorized('Token invalido o mal formado - USER ID NULL'))
            return
        }        
        if (!ObjectId.isValid(decodede.id)) {
            next(Boom.unauthorized('Token invalido o mal formado'))
            return
        }
        let user = awaitFor(userModel.findOne({_id: decodede.id}, {user_type: 1}))
        if (user == null) {
            next(Boom.unauthorized('Token invalido o mal formado - auth'))
            return
        }
        winston.log('debug', 'New refresh login from', {user: user.name})
        let token = jwt.sign({
            user_type: user.user_type,
            id: user._id,
            name: user.name,
            lastname: user.lastname,
            picture: user.picture
        }, config.jwtSecret,{ expiresIn: '2m', })
        
        res.setHeader('authorization',token)
        res.setHeader('access-control-expose-headers','authorization')
        res.setHeader('access-control-allow-headers','authorization')
        //res.setHeader('authorization', decodede)       
        next()        
    }
    else {
            next(Boom.unauthorized('Token invalido o mal formado'))
    }
})

reloadToken.unless = unless

module.exports = {
    reloadToken: reloadToken
}