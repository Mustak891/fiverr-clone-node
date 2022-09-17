import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    propic: {
        type: String,
        default: "",
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

export default Job;

