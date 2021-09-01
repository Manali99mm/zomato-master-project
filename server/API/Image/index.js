import express from "express";
import passport from "passport";
import multer from "multer";

// Database Model
import { ImageModel } from "../../database/allModels";

// Utilities
import { s3Upload } from "../../Utils/AWS/s3";

const Router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });


/*
Route           /image
Description     Uploads given image to S3 bucket, and saves file link to mongodb
Access          PUBLIC
Parameters      none
Method          POST
*/
Router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;

        // s3 bucket options
        const bucketOptions = {
            Bucket: "zomatomasterproj",
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
        };

        const uploadImage = await s3Upload(bucketOptions);

        return res.status(200).json({ uploadImage });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

export default Router;