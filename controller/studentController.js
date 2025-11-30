import File from "../model/fileModel.js";

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
