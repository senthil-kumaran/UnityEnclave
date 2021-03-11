const crypto = require('crypto')

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone1: {
        type: Number,
        required: [true, 'Please tell us your phone number!'],
        min: [1000000000, 'Please validate phone number'],
        max: [9999999999, 'Please validate phone number']
    },
    phone2: {
        type: Number,
        min: 1000000000,
        max: 9999999999
    }, 
    email: {
        type: String,
        required: [true, 'Please tell us your email!'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password!'],
        minlength: [6, 'Password must be greater than 5 characters'],
        select: false
    },
    confirmPassword: { 
        type: String,
        required: [true, 'Please confirm password!'],
        validate: {
            validator: function(el) {
                return this.password === el
            },
            message: 'Passwords don\'t match'
        }
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['user', 'home_owner', 'admin', 'super_user', 'president'],  
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    photo: {
        type: String,
        default: 'default.svg'
    }
});

//pre hook
userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
    this.confirmPassword = undefined
    this.passwordChangedAt = Date.now() - 1000
    next() 
})

// Instance method
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPassword = function(JWTTimeStamp) {
    let passwordUpdatedTime = this.passwordChangedAt.getTime() / 1000 
    passwordUpdatedTime = parseInt(passwordUpdatedTime)
   
    return passwordUpdatedTime > JWTTimeStamp
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(8).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000
    
    return resetToken 
}

const userModel = mongoose.model('users', userSchema)

module.exports = userModel