const multer = require("multer");
const path = require("path");

const cloudinary = require("../util/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Select the Cloudinary folder based on the upload type
const getFolder = (req) => {
  switch (req.body.type) {
    case "site":
      return "sitetrack/sites";

    case "manager":
      return "sitetrack/managers";

    case "worker":
      return "sitetrack/workers";

    case "expense":
      return "sitetrack/bills";

    default:
      return "sitetrack/others";
  }
};

// Configure Cloudinary as Multer's storage engine
const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: (req, file) => getFolder(req),

    public_id: (req, file) => {
      const name = path.parse(file.originalname).name;

      const safeName = name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "");

      return `${Date.now()}-${safeName || "image"}`;
    },
  },
});

// Accept image files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/avif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum
  },
});

module.exports = upload;