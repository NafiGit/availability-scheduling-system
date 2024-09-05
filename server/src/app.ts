import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
// import userRoutes from './routes/users';
// import availabilityRoutes from './routes/availabilities';
// import sessionRoutes from './routes/sessions';
import { errorHandler } from './middleware/errorHandler';
import routeCollector from './routes/routeCollector';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/availabilities', availabilityRoutes);
// app.use('/api/sessions', sessionRoutes);
app.use('/api', routeCollector);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;