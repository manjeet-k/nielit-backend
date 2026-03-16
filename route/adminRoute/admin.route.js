import {Router} from "express"
import { getUserById, updateStudent } from "../../controller/student.controller.js";
import { adminLogin } from "../../controller/admin/adminLogin.controller.js";
const adminRoute = Router()


adminRoute.post("/login", adminLogin)

adminRoute.patch("/updateStudent/:studentId" , updateStudent)
adminRoute.get("/studentDetails/:studentId" , getUserById)

export default adminRoute;