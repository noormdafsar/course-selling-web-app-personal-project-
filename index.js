const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const { userRouter } = require('./routes/user');
const { adminRouter } = require('./routes/admin');
const { courseRouter } = require('./routes/course');

const port = 3000;

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter);

// createCourseRoutes(app); // this is more clean and structured code.
// createUserRoutes(app);
async function main() {
    await mongoose.connect("mongodb+srv://nooruddinmdafsarit25:Nooruddin%40786@cluster0.ztsoe50.mongodb.net/course_selling_web_app")
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
}

main().catch(err => console.log(err));