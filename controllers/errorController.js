const { connection } = require('mongoose')
const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateErrorDB = err => {
    const errorField = Object.values(err.keyValue)
    return new AppError('This email is already in use!', 400)
}

const handleValidationErrorDB = err => { 
    const arrOfErrors = Object.values(err.errors)
    const arrOfErrMsg = arrOfErrors.map(error => error.message)
    const message = arrOfErrMsg.join('. ')
    
    return new AppError(message, 400)
}

const handleMulterError = () => {
    return new AppError('Maximum of 15 images can be uploaded', 400)
} 

const handleLogInError = () => {
    return new AppError('Please log in to continue', 401)
}

const sendErrorDev = (req, res, err) => {
    if (!err.operational)
        err.errorCode = 500

    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.errorCode).json({
            status: err.errorStatus,
            data: {
                error: err,
                stack: err.stack
            }
        })
    }

    res.status(err.errorCode).render('error', {
        title: 'Something went wrong',
        message: err.message
    })
}

const sendErrorProd = (res, err) => {
    if(err.render) {
        return res.status(err.errorCode).render('error', {
            page: 'Invalid request',
            errorCode: err.errorCode || 500,
            message: err.errorMessage
        })
    }

    // Operational and Trusted errors, send res to client
    if (err.operational) {
        return res.status(err.errorCode).json({
            status: err.errorStatus,
            data: {
                message: err
            }
        })
    }
    // Non operational or unknown errors, send a generic res to client
    else {
        return res.status(500).json({
            status: err.errorStatus,
            data: {
                message: 'Something went very wrong!'
            }
        })
    }
}

module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(req, res, err)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        error.name = err.name

        if (error.name === 'CastError') // ODM (Mongoose error) 
            error = handleCastErrorDB(error)
        else if (error.code === 11000)   // Driver (MongoDB error)
            error = handleDuplicateErrorDB(error)
        else if (error.name === 'ValidationError') 
            error = handleValidationErrorDB(error)
        else if(error.name === 'MulterError' || error.errorMessage === 'Maximum of 15 images can be uploaded') {
            error = handleMulterError()
            error.render = true  
        }
        else if(error.name === 'JsonWebTokenError') {
            error = handleLogInError()
            error.render = true
        }    
        else if(error.errorMessage === 'You are not logged in. Please log in to continue') {
            error = handleLogInError()
            error.render = true
        }
        else if(error.errorMessage === 'You don\'t have permission for this action') {
            error = new AppError(error.errorMessage, 401)
            error.render = true
        }
            
        sendErrorProd(res, error)
    }
} 