import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "jewelry-store-products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};