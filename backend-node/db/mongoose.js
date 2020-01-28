const mongoose = require('mongoose');

const mongoConnUrl = "mongodb://localhost:27017/refreshTokenDB"

// Connect to MongoDB
mongoose.connect(mongoConnUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// When connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open on ' + mongoConnUrl);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});


module.exports = { mongoose };