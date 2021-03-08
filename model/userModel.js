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
        unique: true
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
        enum: ['user', 'home_owner', 'admin', 'super_user', 'president'],  // other than these options error is sent as response - pending
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

// Both pre and post hooks need to be added to the schema before registering the model in the file.
//pre hook
userSchema.pre('save', async function(next) {
    console.log('In save pre hook')
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
    this.confirmPassword = undefined
    this.passwordChangedAt = Date.now() - 1000
    next() // just like any other m/w use next()
})

/* Not necessary as of now 

userSchema.pre(/^find/, async function(next) {
    console.log('In find pre hook')
    next()
})

*/

// Instance method
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    console.log('In crt pwd mtd')
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPassword = function(JWTTimeStamp) {
    console.log('In changed pwd mtd')
    let passwordUpdatedTime = this.passwordChangedAt.getTime() / 1000 // Produce float value
    passwordUpdatedTime = parseInt(passwordUpdatedTime)
   
    return passwordUpdatedTime > JWTTimeStamp
}

userSchema.methods.createPasswordResetToken = function() {
    console.log('In pwd reset mtd')
    // const resetToken = crypto.randomBytes(32).toString('hex')
    const resetToken = crypto.randomBytes(8).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000
    
    return resetToken 
}

const userModel = mongoose.model('users', userSchema)

module.exports = userModel