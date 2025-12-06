import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";

export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
};
