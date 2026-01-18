const { Router, default: e } = require('express');
const adminRouter = Router();
const { adminModel, courseModel } = require('../db');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { ca } = require('zod/v4/locales');

const adminSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(3),
})

const courseSchema = z.object({
    name: z.string().min(3, "Course Name must be at least 3 characters long"),
    description: z.string().min(6, "Description must be at least 6 characters long"),
    price: z.number().positive(),
    instructor: z.string().min(3),
    rating: z.number().min(1).max(5),
    createdAt: z.date(),
    updatedAt: z.date(),
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

            // New Admin is getting created:
            await newAdminUser.create();
            
            // Admin details getting save:
            await newAdminUser.save();
            
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

adminRouter.post('/login', async function (req, res) {
    try {
        const parsedData = adminSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                success: false,
                message: parsedData.error.issues[0].message
            })
        }
        else {
            const { email, password } = parsedData.data;
            const existingAdminUser = await adminModel.findOne({ email });

            // check if user exist:
            if (!existingAdminUser) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                })
            }

            // check if email is valid:
            const isEmailValid = await bcrypt.compare(email, existingAdminUser.email);
            if (!isEmailValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email"
                })
            }

            // check if password is valid:
            const isPasswordValid = await bcrypt.compare(password, existingAdminUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: "Admin user logged in successfully"
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

adminRouter.post('/logout', function (req, res) {
    return res.status(200).json({
        success: true,
        message: "Admin user logged out successfully"
    })
})

// Course creation by admin:
adminRouter.post('/create-course', function (req, res) {
    try {
        const { name, description, price, instructor, rating } = req.body;
        const parsedData = courseSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(401).json({
                success: false,
                message: parsedData.error.issues[0].message
            })
        }
        else {
            const newCourse = new courseModel({
                name,
                description,
                price,
                instructor,
                rating
            })

            newCourse.create();
            return res.status(201).json({
                success: true,
                message: "Course created successfully"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

})

// Course list
adminRouter.get('/courses', function (req, res) {
    try {
        const courses = courseModel.find();
        if (!courses) {
            return res.status(404).json({
                success: false,
                message: "No courses found"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                data: courses
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = {
    adminRouter: adminRouter
}