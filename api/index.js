import express from "express";
import connectDB from "../config/db.js";
import dotenv from "dotenv"
import authRoutes from "../routes/auth.js";
import fileRoutes from "../routes/file.js";
import studentRoutes from "../routes/student.js";

dotenv.config();
const app = express();
app.use(express.json());
connectDB();
const port = 3000;


app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/student", studentRoutes);

app.get('/',(req, res) => {
    res.send('Boom!! This StudyGeni is Running... ');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});