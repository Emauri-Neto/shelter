import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";
import { UNAUTHORIZED } from "../constants/http";
import mongoose from "mongoose";


const isAuthenticated:RequestHandler = (req, res, next) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(accessToken, 401, 'Not authorized', AppErrorCode.InvalidAccessToken);

    const { error, payload } = verifyToken(accessToken);
    appAssert(payload, UNAUTHORIZED, error === 'jwt expired' ? "Token expired" : "Invalid token", AppErrorCode.InvalidAccessToken);


    req.userId = payload.userId as mongoose.Types.ObjectId;

    req.sessionId = payload.sessionId as mongoose.Types.ObjectId;
    next();
}

export default isAuthenticated;