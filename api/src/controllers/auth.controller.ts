import catchErrors from '../utils/catchErrors';
import { createAccount, loginUser, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from '../services/auth.service';
import { CREATED, OK, UNAUTHORIZED } from '../constants/http';
import { clearAuthCookies, getAccessTokenCookieOpts, getRefreshTokenCookieOpts, setAuthCookies } from '../utils/cookies';
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationCodeSchema } from './auth.schemas';
import { verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';
import appAssert from '../utils/appAssert';

export const registerController = catchErrors(async (req, res) => {
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']
    });

    const { user, accessToken, refreshToken } = await createAccount(request);

    return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json({ user });
});

export const loginController = catchErrors(async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']
    });

    const { accessToken, refreshToken } = await loginUser(request);

    return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({ message: 'Login successfully' });
});

export const logoutController = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string | undefined;

    const { payload } = verifyToken(accessToken || '');

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res).status(OK).json({ message: 'Logout successfully' });
});

export const refreshController = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, 'Refresh token is required');

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOpts());
    }
    return res.status(OK).cookie('accessToken', accessToken, getAccessTokenCookieOpts()).json({ message: 'Access token refreshed' });
});

export const verifyEmailController = catchErrors(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(verificationCode);

    return res.status(OK).json({ message: 'Email was successfully verified' });
});

export const sendPasswordResetController = catchErrors(async (req, res) => {
    const email = emailSchema.parse(req.body.email);

    await sendPasswordResetEmail(email);

    return res.status(OK).json({
        message: 'Password reset email sent'
    });
});

export const resetPasswordController = catchErrors(async (req, res) => {
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);

    return clearAuthCookies(res).status(OK).json({ message: 'Password reset successfully' });
});