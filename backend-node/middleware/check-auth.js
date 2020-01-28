const jwt = require('jsonwebtoken');
const secret = 'notSoGoodSecret';

/* This middleware is used for JWT Auth verification */
module.exports = (req, res, next) => {

    try {
        // Get the token from Authorization header
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        // console.log('decoded', decoded);
        // Pass the user data to the request object
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};