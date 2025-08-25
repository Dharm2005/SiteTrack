// multer storage
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/others"; // default
    
    if (req.body.type === "site") folder = "uploads/sites";
    if (req.body.type === "manager") folder = "uploads/managers";
    if (req.body.type === "worker") folder = "uploads/workers";
    if (req.body.type === "expense") folder = "uploads/bills";
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const name = path.parse(file.originalname).name; // 👉 just "myphoto"
    const ext = path.extname(file.originalname);     // 👉 ".png"
    const safeName = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

    cb(null, Date.now() + "-" + safeName + ext);
  }
})

const fileFilter = (req , file , cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg'){
    cb(null,true);
  }else{
    cb(new Error('Not an image! Please upload an image.'), false);
  }
}

const upload = multer({
  storage, 
  fileFilter,
  limits: 5 * 1024 * 1024
})

module.exports = upload;