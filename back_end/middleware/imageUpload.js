// multer storage
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
   filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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