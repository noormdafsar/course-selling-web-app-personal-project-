const { Router } = require('express');
const courseRouter = Router();
const { courseModel, purchaseModel } = require('../db');
// const { z } = require('zod');

// const courseSchema = z.object({
//     name: z.string().min(3, "Course Name must be at least 3 characters long"),
//     description: z.string().min(6, "Description must be at least 6 characters long"),
//     price: z.number().positive(),
//     instructor: z.string().min(3),
//     rating: z.number().min(1).max(5),
//     createdAt: z.date(),
//     updatedAt: z.date(),
// })

// This is for list of all the available course show for users who loggedIn or signup for buying new course
courseRouter.get('/courses', async function (req, res) {
    try {
        const courses = await courseModel.find();

        if (!courses || courses.length === 0) {
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
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// This is for the users who already purchased course and here they wanted to see all their purchased course
courseRouter.get('/purchased', async function (req, res) {
    try {
        const purchasedCourses = await purchaseModel.find({ userId: req.user._id }).populate('courseId');

        if (!purchasedCourses || purchasedCourses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No purchased courses found for this user"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                data: purchasedCourses
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
    courseRouter: courseRouter
}