const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const secret = 'notSoGoodSecret';
const checkAuth = require('./middleware/check-auth');

require('./db/mongoose');
const User = require('./models/users');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const expiresIn = '1m';

app.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    const role = 'admin';

    const token = jwt.sign({
        'email': email,
        'role': role
    }, secret, { expiresIn: expiresIn });
    const refreshToken = randToken.uid(256);

    console.log('token', token);
    console.log('refreshToken', refreshToken);

    User.findOne({ "email": email, "password": password }).then(result => {
        if (result != undefined) {

            User.findOneAndUpdate({ email: email }, { $set: { refreshToken: refreshToken } }).
                then(doc => {
                    return res.status(200).json({
                        token: token,
                        refreshToken: refreshToken
                    });
                }).catch(error => {
                    console.log('error', error);
                });

        } else {
            return res.status(404).json({
                message: "user not found"
            })
        }
    }).catch(error => {
        console.log('error', error.message);
        return res.status(502).json({
            message: error.message
        });
    });

});

app.get('/dashboard', checkAuth, (req, res, next) => {
    console.log(req.userData);
    return res.status(200).json({
        data: {
            email: req.userData.email,
            role: req.userData.role
        }
    })
});

app.post('/refresh-token', (req, res, next) => {
    let refreshToken = req.body.refreshToken;
    User.findOne({ refreshToken: refreshToken }).then(result => {
        console.log('result', result);

        const token = jwt.sign({
            'email': result.email,
            'role': result.role
        }, secret, { expiresIn: expiresIn });
        const refreshToken = randToken.uid(256);

        console.log('token', token);
        console.log('refreshToken', refreshToken);

        User.findOneAndUpdate({ email: result.email }, { $set: { refreshToken: refreshToken } }).
            then(doc => {
                return res.status(200).json({
                    token: token,
                    refreshToken: refreshToken
                });
            }).catch(error => {
                console.log('error', error);
            });

    }).catch(error => {
        console.log('error', error);
    });
});

app.post('/logout', (req, res, next) => {
    let refreshToken = req.body.refreshToken;
    User.findOne({ refreshToken: refreshToken }).then(result => {
        console.log('result', result);
        User.findOneAndUpdate({ _id: result._id }, { $set: { refreshToken: "" } }).then(uResult => {
            return res.status(200).json({
                message: "Success"
            });
        }).catch(error => {

        });
    });
});

app.listen(7001, () => {
    console.log('Server started');
});