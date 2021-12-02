require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const helmet = require('helmet')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

const app = express()

app.use(helmet())

// Import routes modules
const routes = require('./routes/routes')
const users_routes = require('./routes/users')
const notes_routes = require('./routes/notes')

// Middleware
app.use(morgan('combined'))
app.use(bodyParser.json())

// Define routes patch
app.use('/api', routes)
app.use('/api/users', users_routes)
app.use('/api/notes', notes_routes)

// Catch 440 Errors and forward them to an error handler 
app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} was not found!`)
    err.status = 404
    next(err)
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    // Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });

    // Logging locally
    console.error(err)
});

// Start the NordNotes NodeJS server
const port = app.get('port') || process.env.PORT || 3000
app.listen(port, ()=>console.log(`NordNotes API Server is running on port ${port}. Have a nice day!`))