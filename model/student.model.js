import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    status :{
        type    :Boolean,
        default: false,
    },
    fullName: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true
    },
    aadhar: {
        type: String,
        required: true
    },
    tenthDMC :{
        type: String,
        required: true
    },
    sign:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    randomId:{
        type: String,
        default :""
    },

    randomPassword:{
        type: String,
        default :""
    }

}, { timestamps: true })

export default mongoose.model("Student", studentSchema);