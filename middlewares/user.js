const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('../config/config');

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    else {
        try {
            const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
            req.userId = decoded.id;
            next();
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
    }
}

module.exports = {
    userMiddleware: userMiddleware
}