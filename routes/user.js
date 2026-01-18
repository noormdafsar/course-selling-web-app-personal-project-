const { Router } = require('express');
const userRouter = Router();
const { userModel } = require('../db');
const { z } = require('zod');

const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string(),
    courses: z.array(z.string()).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

userRouter.post('/signup', async function (req, res) {

    try {
        // 1. Input validation:
        const parsedData = userSchema.safeParse(req.body);

        // 2. Hash the input password so that plainText password must not save inot database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: parsedData.error.issues[0].message
            })
        }
        else {
            const { name, email, password, role } = parsedData.data;
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User with this email already exists"
                })
            }
            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                role
            })
            await newUser.create();
            await newUser.save();
            res.status(201).json({
                success: true,
                message: "User created successfully"
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

userRouter.post('/login', async function (req, res) {
    try {
        // Input validation:
        const parsedData = userSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: parsedData.error.issues[0].message
            })
        }
        else {
            const { email, password } = req.body;
            const existingUser = await userModel.findOne({ email });

            // check if user exist:
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            // check if email is valid:
            const isEmailValid = await bcrypt.compare(email, existingUser.email);
            if (!isEmailValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email"
                })
            }

            // check if password is valid:
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully"
                })
            }
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

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