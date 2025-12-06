import multer from "multer";
import path from "path";
import fs from "fs";

export const createLocalUploader = ({
    folderName = "uploads",
    filePrefix = "file",
    fileSizeMB = 2,
    fieldType = "single",
    fieldName = "file",
    maxCount = 1,
    customFields = []
}) => {

    const uploadDir = path.join(process.cwd(), "public", folderName);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const first4 = file.originalname.slice(0, 4);
            cb(null, `${filePrefix}-${timestamp}-${first4}${ext}`);
        },
    });

    const fileFilter = (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Invalid file type. Allowed: JPG, PNG, WEBP"));
        }
        cb(null, true);
    };

    const upload = multer({
        storage,
        limits: { fileSize: fileSizeMB * 1024 * 1024 },
        fileFilter,
    });

    if (fieldType === "single") return upload.single(fieldName);
    if (fieldType === "array") return upload.array(fieldName, maxCount);
    if (fieldType === "fields") return upload.fields(customFields);
    return upload;
};



export const uploadProfileImage = createLocalUploader({
    folderName: "profile",
    filePrefix: "profile",
    fieldType: "single",
    fieldName: "image",
    fileSizeMB: 2,
});
