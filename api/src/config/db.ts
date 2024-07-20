import mongoose from 'mongoose';
import { MONGODB_URI } from '../constants/env';

export const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URI);

        logging.log('Connected to MongoDB version', connection.version);
    } catch (error) {
        logging.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
};
