import express from "express";
import cors from "cors";
import studentRoute from "./route/student.route.js";
import adminRoute from "./route/adminRoute/admin.route.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json())
app.use(cors(
    {
        origin: [
            "https://nielit-frontend.vercel.app",
            "https://nielit-panel.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001",
        ],
        methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
        credentials: true
    }
))

app.get("/",(req,res)=>{
    res.send("Expert Computer Course")
})
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/api/v1/admin" , adminRoute)
app.use("/api/v1/student", studentRoute)


export default app;