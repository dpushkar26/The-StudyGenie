import express from "express";
import { protect } from "../middleware/auth.js";

import { getAllFiles, getFileById } from "../controller/studentController.js";

const router = express.Router();

// router.get("/files", protect, getAllFiles);
// router.get("/files/:id", protect, getFileById);

router.get("/files", getAllFiles);
router.get("/files/:id", getFileById);

export default router;
