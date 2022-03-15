const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const {
    S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY,
    S3_BUCKET_REGION,
    S3_BUCKET_NAME,
} = process.env;

const s3 = new aws.S3({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_BUCKET_REGION,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: function (req, file, cb) {
            if (!file) next();
            else {
                let arr = file.originalname.split(".");
                let ext = arr[arr.length - 1].trim().toLowerCase();

                if (
                    ext !== "png" &&
                    ext !== "gif" &&
                    ext !== "jpg" &&
                    ext !== "jpeg"
                )
                    return;

                cb(
                    null,
                    Math.floor(Math.random() * 1000).toString() +
                        Date.now() +
                        "." +
                        file.originalname.split(".").pop()
                );
            }
        },
    }),
    limits: {
        fileSize: 1000 * 1000 * 10,
    },
});

module.exports = upload;
