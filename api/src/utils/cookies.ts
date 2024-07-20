import { Response, CookieOptions } from 'express';
import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date';

export const REFRESH_PATH = '/auth/refresh';

const secure = process.env.NODE_ENV !== 'development';

const defaults: CookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure
};

export const getAccessTokenCookieOpts = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow()
});

export const getRefreshTokenCookieOpts = (): CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH
});

type Params = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
    res.cookie('accessToken', accessToken, getAccessTokenCookieOpts()).cookie('refreshToken', refreshToken, getRefreshTokenCookieOpts());

export const clearAuthCookies = (res: Response) =>
    res.clearCookie('accessToken').clearCookie('refreshToken', {
        path: REFRESH_PATH
    });
