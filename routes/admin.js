const { Router, default: e } = require('express');
const adminRouter = Router();
const { adminModel } = require('../db');
const { z } = require('zod');
const bcrypt = require('bcrypt')

const adminSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(3),
})


adminRouter.post('/signup', async function (req, res) {
    try {
        // Input validation:
        const parsedData = adminSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                success: false,
                message: parsedData.error.issues[0].message
            })
        }
        else {
            const { email, password, name } = parsedData.data;
            const existingAdminUser = await adminModel.findOne({ email });
            if (existingAdminUser) {
                return res.status(400).json({
                    success: false,
                    message: "Admin with this user name already exists"
                })
            }
            // Hash password so that plaintext must not enter into database:
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Save admin user into database
            const newAdminUser = new adminModel({
                email,
                password: hashedPassword,
                name
            })
            await newAdminUser.create();
            res.status(201).json({
                success: true,
                message: "Admin user created successfully"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

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

adminRouter.get('/courses', function (req, res) {
    res.json({
        success: true,
        message: "get courses successfully"
    })
})

module.exports = {
    adminRouter: adminRouter
}