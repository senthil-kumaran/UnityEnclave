const { promisify } = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const userModel = require('../model/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Email = require('../utils/email')
const { createToken, sendToken } = require('../utils/createAndSendToken') 

exports.signUp = catchAsync(async (req, res, next) => {
    const { firstName, lastName, phone1, phone2, email, password, confirmPassword, role } = req.body
    console.log('Befor create')
    const user = await userModel.create({
        firstName,
        lastName,
        phone1,
        phone2,
        email,
        password,
        confirmPassword,
        role
    })
    console.log('after create')

    const token = await createToken(user._id)

    const url = `${req.protocol}://${req.get('host')}/settings`
    await new Email(user, url).sendWelcome()

    sendToken(req, res, 201, token, user)
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password)
        return next(new AppError('Please enter the required fields', 400))       

    //1) Check if the user exists
    const user = await userModel.findOne({ email }).select('+password +active')   
    
    if(!user || !user.active)
        return next(new AppError('No account with this email id', 400))
        
    //2) Verify the password entered
    if(!await user.correctPassword(password, user.password))
        return next(new AppError('Incorrect password', 401))
    
    const token = await createToken(user._id)
    
    sendToken(req, res, 200, token)
})

exports.logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({status: 'success'})
}

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = req.user 
    const currentUser = await userModel.findById(user.id).select('+password')

    const currentPassword = req.body.currentPassword

    if(!await currentUser.correctPassword(currentPassword, currentUser.password))
        return next(new AppError('Password entered is not correct', 401))

    currentUser.password = req.body.newPassword
    currentUser.confirmPassword = req.body.confirmPassword
    await currentUser.save()
    
    const token = await createToken(currentUser._id)
    
    sendToken(req, res, 200, token, currentUser, 'Password updated successfully!')
})

exports.isLoggedIn = async (req, res, next) => {
    try {
        if(req.cookies.jwt) {
            // 1) Assign the cookie
            const token = req.cookies.jwt
    
            // 2) Verify the token
            const decodedVerifiedToken = await promisify(jwt.verify)(token, process.env.SECRET)
        
            // 3) Check if the user exists
            const currentUser = await userModel.findById(decodedVerifiedToken.id)
    
            if(!currentUser)
                return next()  //No error is sent for UI access of resources
    
            // 4) Check if there is any password change after the token was issued
            if(currentUser.changedPassword(decodedVerifiedToken.iat)) 
                return next()  //No error is sent for UI access of resources
    
            res.locals.user = currentUser  // This setting of local variable is only done when the user logged in else as in the above code next m/w would have been called
            if(currentUser.role !== 'user')
                res.locals.poster = true   // Indicates user is home_owner or admin

            return next()
        }
    } catch(err) {
        return next()
    }
    
    next()  
}

exports.protectRoute = catchAsync(async (req, res, next) => {
    // 1) Check if the token is present in the req header
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization
        token = token.split(' ')[1]
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if(!token) {
        return next(new AppError('You are not logged in. Please log in to continue', 401))
    }

    // 2) Verify the token
    const decodedVerifiedToken = await promisify(jwt.verify)(token, process.env.SECRET)
 
    // 3) Check if the user exists
    const currentUser = await userModel.findById(decodedVerifiedToken.id)

    if(!currentUser)
        return next(new AppError('User doesn\'t exists', 401))

    // 4) Check if there is any password change after the token was issued
    if(currentUser.changedPassword(decodedVerifiedToken.iat)) 
        return next(new AppError('User recently changed the password. Please log in again', 401))

    req.user = currentUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError('You don\'t have permission for this action', 401))
        
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Fetch the user by his/her email (req contains the email as sent by user)
    const user = await userModel.findOne({ email: req.body.email })

    // 2) Check if the email returns a user
    if(!user)
        return next(new AppError('No user with this email id', 404))

    // 3) Generate a random token string
    const token = user.createPasswordResetToken()

    // 4) Persist the passwordResetToken field in DB
    await user.save({ validateBeforeSave: false })

    try {
        await new Email(user, token).sendPasswordReset()
    } catch(err) {
        user.passwordResetToken = undefined   
        user.passwordResetExpiresIn = undefined

        return next(new AppError('There is an error in sending the reset password email', 500))
    }

    res.status(200).json({
        status: 'success',
        data: {
            message: 'Reset token sent to the user\'s email'
        }
    })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get the token and encrypt it to fetch the user
    // 2) Set the new password from the req body and set undefined to resetToken field in db and update the pwdChangedAt field
    const { token } = req.body

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    
    const user = await userModel.findOne({ passwordResetToken: hashedToken })

    if(!user)
        return next(new AppError('Token is invalid', 401))

    if(user.passwordResetExpiresIn < Date.now()) 
        return next(new AppError('Token expired', 401))  

    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetExpiresIn = undefined
    
    await user.save()
    
    const jwtToken = await createToken(user._id)
        
    sendToken(req, res, 200, token, user)
})