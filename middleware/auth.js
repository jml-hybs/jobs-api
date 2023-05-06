const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');


const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError("Authentication Failed")
    }

    const token = authHeader.split(' ')[1]

    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        if (Date.now() >= decode.exp * 1000) {
            throw new TokenExpiredError();
        }
        req.burat = { userId: decode.id, name: decode.name }
        //  console.log(req.burat);
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid Bearer Token' });
        }
    }
}


// TRY THE ASYNC HANDLER ERROR HANDLER HERE TO REMOVE THE TRY CATCH BLOCK

module.exports = authenticationMiddleware 