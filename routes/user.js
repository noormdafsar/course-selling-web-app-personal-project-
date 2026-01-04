const { Router } = require('express');
const userRouter = Router();


    userRouter.post('/signup', function (req, res) {
        res.json({
            success: true,
            message: "signup successfully"
        })
    })


    userRouter.post('/login', function (req, res) {
        res.json({
            success: true,
            message: "login successfully"
        })
    })

    userRouter.post('/logout', function (req, res) {
        res.json({
            success: true,
            message: "logout successfully"
        })
    })
module.exports = {
    userRouter: userRouter
} 