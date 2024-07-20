import 'dotenv/config';
import express from 'express';
import logging from './config/logging';
import { connectToDB } from './config/db';
import { CLIENT_URL, NODE_ENV, PORT } from './constants/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import { loggingHandler } from './middleware/loggingHandler';
import { OK } from './constants/http';
import authRoutes from './routes/auth.route';
import isAuthenticated from './middleware/isAuthenticated';
import userRoutes from './routes/user.route';
import sessionRoutes from './routes/session.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true
    })
);
app.use(cookieParser());
app.use(loggingHandler);

app.get('/api/healthcheck', (req, res) => {
    return res.status(OK).json({ message: 'Healthy' });
});

// auth routes

app.use('/auth', authRoutes);

// protected routes

app.use('/user', isAuthenticated, userRoutes);

app.use('/sessions', isAuthenticated, sessionRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
    const connection = await connectToDB();
    logging.log(`Server running on ${PORT} 🚀 on ${NODE_ENV} environment 🌐`);
});
