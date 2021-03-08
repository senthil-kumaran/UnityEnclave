const express = require('express')
const path = require('path')

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const pug = require('pug')
const cookieParser = require('cookie-parser')
const { urlencoded } = require('express')
const hpp = require('hpp')
const compression = require('compression')

const userRouter = require('./route/userRouter')
const homeRouter = require('./route/homeRouter')
const viewRouter = require('./route/viewRouter')
const appError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
 
const app = express()

//SECURITY HEADERS -NPM PACKAGE
app.use(helmet())

//BODY PARSER -BUILTIN
app.use(express.json({ limit: '10kb' })) 

//NOSQL INJECTION PREVENTER -NPM PACKAGE
app.use(mongoSanitize())

//CROSS SITE SCRIPTING(XSS) PREVENTER -NPM PACKAGE
app.use(xss())

//DOS ATTACK PREVENTER -NPM PACKAGE
const limit = rateLimit({
    max: 100,
    windowMs: 1 * 60 * 60 * 1000,
    message: 'Too many requests. Try again in one hour'
})

app.use('/api', limit)

app.use(cookieParser())

app.use(urlencoded({ extended: true, limit: '10kb' }))

// PARAMETER POLLUTION PREVENTER -NPM PACKAGE
app.use(hpp())

app.use(compression()) 

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(`${__dirname}/views`)) 
app.set('view engine', 'pug')

app.use('/', viewRouter) 
app.use('/api/v1/users', userRouter) 
app.use('/api/v1/homes', homeRouter)

// app.use('/api/v2/features', featureRouter) 

app.use(globalErrorHandler)

app.get('*', (req, res) => {
    res.status(404).render('error', { 
        title: 'Not found | 404',
        errorCode: '404',
        message: 'Not found'
    })
}) 
 
module.exports = app