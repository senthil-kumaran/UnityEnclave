process.on('uncaughtException', err => {
    console.log('💥 Error happened - Un Caught Exception - SERVER SHUTINGDOWN.....!')
    console.log(`ERROR IS : ${err}`)
    process.exit(1)
})

const app = require('./app')
var mongoose = require('mongoose'); 
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

var mongoDB = process.env.DB_CONNECTION_STRING
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection;

db.on('error', console.error.bind(console, '💥 FROM DB EVENT - MongoDB connection error:'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server started at ${process.env.PORT}`)
})

process.on('unhandledRejection', err => {
    console.log('💥 Error happened - Un Handled Rejection - SERVER SHUTINGDOWN.....!')
    console.log(`ERROR IS : ${err}`)
    server.close(() => {
        process.exit(1)
    })
})

process.on('SIGTERM', () => {
    console.log('🌚 SIGTERM Received! ---> Shutting server gracefully')
    server.close(() => {
        console.log('💥 Process terminated')
    })
})