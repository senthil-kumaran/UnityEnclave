class AppError extends Error {
    constructor(errorMessage, errorCode) {
        super(errorMessage)

        this.errorCode = errorCode
        this.errorStatus = `${errorCode}`.startsWith('4')? 'fail' : 'error'
        this.errorMessage = errorMessage
        this.operational = true

        Error.captureStackTrace(this, this.constructor)
    } 
}

module.exports = AppError