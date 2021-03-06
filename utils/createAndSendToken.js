const jwt = require('jsonwebtoken')

exports.createToken = (payload) => {  // Not an async. Check if .sign returns a promise - pending
    return jwt.sign({ id: payload }, process.env.SECRET, {
        expiresIn: '30d'
    })
}

exports.sendToken = (req, res, statusCode, token, user, message) => {
    //Send cookie to the client
    const cookieOption = {
        // expires: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),  //In JS for date we need to specify new Date (also see above line mistake)
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    } 

    res.cookie('jwt', token, cookieOption)

    res.status(statusCode).json({
        status: 'success',
        data: {
            token,
            user,
            message
        } 
    })
}