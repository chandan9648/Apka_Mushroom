import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
export const uploadSingle = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file)
        throw new ApiError(400, "No file uploaded");
    const url = `/uploads/${file.filename}`;
    res.status(201).json({ url });
});
