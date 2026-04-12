import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, String(process.env.ACCESS_SECRET), {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, String(process.env.REFRESH_SECRET), {
        expiresIn: "1d",
    });
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, String(process.env.ACCESS_SECRET));
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, String(process.env.REFRESH_SECRET));
};

