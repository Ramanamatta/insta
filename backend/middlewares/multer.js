import multer from "multer";

// For product images (memory storage, works with sharp)
export const imageUpload = multer({ storage: multer.memoryStorage() });

// For reels/videos (disk storage, works with Cloudinary video upload)
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
export const videoUpload = multer({ storage: videoStorage });