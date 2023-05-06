const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/bad-request');
const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/unauthenticated')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "Email already in use"],
        trim: true,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
});

UserSchema.pre('save', async function () {
    const user = this;

    /* if (user.isModified('email') || user.isNew) {

        const checkUser = await mongoose.models.User.findOne({ email: user.email })

        if (checkUser) {
            throw new BadRequestError('Email already exists');
        } */

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword
    }
    //}
});
UserSchema.methods.createJWT = async function () {
    return await jwt.sign({ name: this.name, id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })


}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const checkPassword = await bcrypt.compare(candidatePassword, this.password)
    if (!checkPassword) {
        throw new UnauthenticatedError('Wrong password');
    }
    return checkPassword;
}

/* UserSchema.methods.compare = async function (candidatePassword) {
    const isMatched = bcrypt.compare(candidatePassword, this.password)
    return isMatched

} */


module.exports = mongoose.model('User', UserSchema)