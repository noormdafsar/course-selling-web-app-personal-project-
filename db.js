const mongoose = require("mongoose");
console.log("Yes! my database connected successfully");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
})

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
})

const courseSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    // duration: { type: Number, required: true },
    instructor: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Schema.Types.ObjectId },
    updatedAt: { type: Schema.Types.ObjectId },
})

const purchaseSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    courseId: { type: ObjectId, ref: 'Course', required: true },
    purchaseDate: { type: Date, default: Date.now },
})


const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const courseModel = mongoose.model('Course', courseSchema);
const purchaseModel = mongoose.model('Purchase', purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}