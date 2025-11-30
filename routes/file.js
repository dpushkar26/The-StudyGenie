import express from "express";
import { uploadFile, getAllFiles, getFileById } from "../controller/fileController.js";
import { protect, isTeacher } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { getContentQuiz, getContentSummary } from "../controller/aiController.js";

const router = express.Router();

// router.post("/", protect, isTeacher, upload.single("file"), uploadFile);
// router.get("/", protect, getAllFiles);
// router.get("/:id", protect, getFileById);
router.post("/", protect, isTeacher, upload.single("file"), uploadFile);
router.get("/", getAllFiles);
router.get("/:id", getFileById);
router.get("/:id/summary",getContentSummary)
router.get("/:id/quiz",getContentQuiz)

export default router;