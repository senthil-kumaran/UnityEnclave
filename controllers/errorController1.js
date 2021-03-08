const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateErrorDB = err => {
    const errorField = Object.values(err.keyValue)
    console.log({errorField})
    // return new AppError(`${errorField} is already in use!`, 400)
    return new AppError('This email is already in use!', 400)
}

const handleValidationErrorDB = err => {
    const arrOfErrors = Object.values(err.errors)
    const arrOfErrMsg = arrOfErrors.map(error => error.message)
    const message = arrOfErrMsg.join('. ')
    // const message = 'Invalid data - Please check the input data provided'
    console.log({arrOfErrors})
    console.log({arrOfErrMsg})
    console.log({message})

    return new AppError(message, 400)
}

const handleMulterError = () => {
    // req.errorInfo.errorCode = 400
    // req.errorInfo.message = 'Maximum of 15 images can be uploaded'
    // res.redirect('/error')
    return new AppError('Maximum of 15 images can be uploaded', 400)
} 

const handleLogInError = () => {
    // Handles token invalid and JWT malformed error
    // req.errorInfo.errorCode = 400
    // req.errorInfo.message = 'Please log in to continue'
    // res.redirect('/error')
    return new AppError('Please log in to continue', 400)
}

const sendErrorDev = (req, res, err) => {
    console.log(err.message)
    if (!err.operational)
        err.errorCode = 500

        console.log(req.originalUrl)
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
    if(err.sendAPIResponse) {
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
            console.log('Error : ', err)
            return res.status(500).json({
                status: err.errorStatus,
                data: {
                    message: 'Something went very wrong!'
                }
            })
        }
    }

    res.status(err.errorCode).render('error', {
        page: 'Invalid request',
        errorCode: err.errorCode || 500,
        message: err.message
    })
}

module.exports = (err, req, res, next) => {
    console.log(`In global error handler - ${err}`)

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(req, res, err)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        // let error = Object.assign(err)
        error.name = err.name
        console.log({err})
        console.log({error})
        if (error.name === 'CastError') // ODM (Mongoose error) 
            error = handleCastErrorDB(error)
        else if (error.code === 11000)   // Driver (MongoDB error)
            error = handleDuplicateErrorDB(error)
        else if (error.name === 'ValidationError') {
            error.sendAPIResponse = true 
            error = handleValidationErrorDB(error)
        }
        else if(error.name === 'MulterError' || error.errorMessage === 'Maximum of 15 images can be uploaded')
            error = handleMulterError()
        else if(error.name === 'JsonWebTokenError')
            error = handleLogInError()
        else if(error.errorMessage === 'You are not logged in. Please log in to continue')
            error = handleLogInError()
        else if(error.errorMessage === 'Password entered is not correct')
            error.sendAPIResponse = true 

        sendErrorProd(res, error)
    }
} 