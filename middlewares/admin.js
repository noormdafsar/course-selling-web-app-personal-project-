const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require('../config/config');

function adminMiddleware(req, res, next) {
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
            req.user = decoded;
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
    adminMiddleware: adminMiddleware
}