import {Router} from "express"
import { createStudent, deleteStudent, getAllStudent, loginStudent } from "../controller/student.controller.js";
import { upload } from "../middleware/uploads.js";
const studentRoute = Router();

studentRoute.post("/create-student",upload.fields([
     { name: "tenthDMC", maxCount: 1 },
    { name: "sign", maxCount: 1 },
    { name: "photo", maxCount: 1 }
]) , createStudent)
studentRoute.post("/login-student" , loginStudent)
studentRoute.get("/get-students" , getAllStudent)
studentRoute.delete("/delete-student/:studentId" , deleteStudent)


export default studentRoute;
