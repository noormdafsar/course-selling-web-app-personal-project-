const { Router } = require('express');
const courseRouter = Router();

    courseRouter.get('/courses', function (req, res) {
        res.json({
            success: true,
            message: "get courses successfully"
        })
    })

    courseRouter.get('/purchased', function (req, res) {
        res.json({
            success: true,
            message: "get purchased courses successfully"
        })
    })

module.exports = {
    courseRouter : courseRouter
}