const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const User = require('../models/User')
const { StatusCodes, } = require('http-status-codes')


const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = await user.createJWT()
    res.set('Authorization', `Bearer ${token}`);
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}


const login = async (req, res) => {


    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Provide email and password')
    }

    const luser = await User.findOne({ email })
    if (!luser) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    await luser.comparePassword(password)

    const token = await luser.createJWT()
    //console.log(token);
    res.set('Authorization', `Bearer ${token}`)

    res.status(StatusCodes.OK).json({ user: { name: luser.name }, token })
}



module.exports = { register, login }