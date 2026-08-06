const multer =  require("multer");
const path =  require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
})
    const fileFilter = function (req, file, cb) {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4"
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    }

const upload = multer({ storage, fileFilter });

module.exports = { upload };


