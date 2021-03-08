const AppError = require('./appError')

// module.exports = fn => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(err => {
//             return next(new AppError(err.message, 400))
//     })
// }
// } 

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.log(`In catchAsync - ${err}`)
            console.log({err})
            return next(err)
        })
    }
} 