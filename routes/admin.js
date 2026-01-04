const { Router } = require('express');
const adminRouter = Router();
const { adminModel } = require('../db');

adminRouter.post('/signup', function (req, res) {
    res.json({
        success: true,
        message: "signup successfully"
    })
})

adminRouter.post('/login', function (req, res) {
    res.json({
        success: true,
        message: "login successfully"
    })
})

adminRouter.post('/logout', function (req, res) {
    res.json({
        success: true,
        message: "logout successfully"
    })
})

adminRouter.post('/create-course', function (req, res) {
    res.json({
        success: true,
        message: "create course successfully"
    })
})

adminRouter.get('/courses', function (req,res) {
    res.json({
        success: true,
        message: "get courses successfully"
    })
})

module.exports = {
    adminRouter: adminRouter
}