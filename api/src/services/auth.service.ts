import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from '../constants/http';
import VerificationCodeTypes from '../constants/verificationCodeTypes';
import SessionModel from '../models/session.model';
import UserModel from '../models/user.model';
import VerificationCodeModel from '../models/verificationCode.model';
import appAssert from '../utils/appAssert';
import { ONE_DAY_IN_MS, fiveMinutesAgo, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from '../utils/date';
import jwt from 'jsonwebtoken';
import { RefreshTokenPayload, refreshTokenSignOpts, signToken, verifyToken } from '../utils/jwt';
import { sendMail } from '../utils/sendMain';
import { getPasswordResetTemplate, getVerifyEmailTemplate } from '../utils/emailTemplates';
import { hashValue } from '../utils/bcrypt';

export type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export type ResetPasswordParams = {
    password: string;
    verificationCode: string;
}

export const createAccount = async (data: CreateAccountParams) => {
    const existingUser = await UserModel.exists({ email: data.email });

    appAssert(!existingUser, CONFLICT, 'Email already in use');

    const user = await UserModel.create({
        email: data.email,
        password: data.password
    });

    const userId = user._id;

    const verificationCode = await VerificationCodeModel.create({
        userId,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: oneYearFromNow()
    });
    // send email verification
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

    const { error } = await sendMail({
        to: user.email,
        ...getVerifyEmailTemplate(url)
    });

    if (error) {
        logging.error(error);
    }

    // create session
    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent
    });

    // sign access token & refresh token
    const refreshToken = signToken(
        {
            sessionId: session._id
        },
        refreshTokenSignOpts
    );
    const accessToken = signToken({
        userId,
        sessionId: session._id
    });

    // return user & tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    };
};

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
    //get user by email
    const user = await UserModel.findOne({ email });
    appAssert(user, UNAUTHORIZED, 'Invalid email or password');

    //validate password
    const isValid = await user.comparePassword(password);
    appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

    //create session
    const userId = user._id;

    const session = await SessionModel.create({
        userId,
        userAgent
    });

    const sessionInfo = {
        sessionId: session._id
    };

    // sign access and refresh tokens

    const refreshToken = signToken(sessionInfo, refreshTokenSignOpts);

    const accessToken = signToken({
        ...sessionInfo,
        userId
    });
    // return user & tokens

    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret: refreshTokenSignOpts.secret
    });
    appAssert(payload, UNAUTHORIZED, 'Invalid refresh token');

    const now = Date.now();
    const session = await SessionModel.findById(payload.sessionId);
    appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, 'Session expired');

    // refresh session if it expires in 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
        ? signToken(
              {
                  sessionId: session._id
              },
              refreshTokenSignOpts
          )
        : undefined;

    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id
    });

    return {
        accessToken,
        newRefreshToken
    };
};

export const verifyEmail = async (code: string) => {
    // get the verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeTypes.EmailVerification,
        expiresAt: { $gt: new Date() }
    });
    appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');
    // update user verify to true
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, { _verified: true }, { new: true });
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify email');
    // delete verification code
    await validCode.deleteOne();
    // return user
    return {
        user: updatedUser.omitPassword()
    };
};

export const sendPasswordResetEmail = async (email: string) => {
    // get user email
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User doesn't exist");

    // check email rate limit
    const timeLimit = fiveMinutesAgo();

    const count = await VerificationCodeModel.countDocuments({
        userId: user._id,
        type: VerificationCodeTypes.PasswordReset,
        createdAt: { $gt: timeLimit }
    });

    appAssert(count <= 1, TOO_MANY_REQUESTS, 'Too many requests. Please, try again later');

    // create verification code
    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeTypes.PasswordReset,
        expiresAt
    });

    // send verification email
    const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendMail({
        to: user.email,
        ...getPasswordResetTemplate(url)
    });
    appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);

    // return success
    return {
        url,
        emailId: data.id
    };
};

export const resetPassword = async ({password, verificationCode}: ResetPasswordParams) => {
    // get verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: verificationCode,
        type: VerificationCodeTypes.PasswordReset,
        expiresAt: { $gt: new Date() }
    })
    appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

    // update password
    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        { 
            password: await hashValue(password) 
        });
        appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to reset password');
    
    // delete verification code
    await validCode.deleteOne();
    // delete all sessions
    await SessionModel.deleteMany({ userId: updatedUser._id });
    
    return {
        user: updatedUser.omitPassword()
    }
}