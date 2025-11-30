import File from "../model/fileModel.js";
import cloudinary from "../config/cloud.js";

/**
 * @desc Upload new study material (Teacher only)
 * @route POST /api/files
 */
export const uploadFile = async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    const file = req.file; // uploaded via multer

    if (!title || !subject || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload file buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "studymaterials",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer); // ✅ use buffer, not path
    });

    // Save file info in DB
    const newFile = await File.create({
      title,
      description,
      subject,
      fileUrl: result.secure_url,
      createdBy: req.user._id, // from auth middleware
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
    });
  }
};

/**
 * @desc Get all study materials (accessible to all roles)
 * @route GET /api/files
 */
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("createdBy", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ success: false, message: "Error fetching files" });
  }
};

/**
 * @desc Get a single file by ID
 * @route GET /api/files/:id
 */
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "createdBy",
      "username email role"
    );

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ success: false, message: "Error fetching file" });
  }
};
