const AppError = require('./appError')

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.log(`PORT ----> ${process.env.port}`)
            console.log(`ERROR ________ ${err}`)
            return next(err)
        })
    }
} 